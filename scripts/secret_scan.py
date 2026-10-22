#!/usr/bin/env python3
"""Scan staged changes and reachable Git history for credential material."""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from collections.abc import Iterable
from pathlib import PurePosixPath


SECRET_PATTERNS: tuple[tuple[str, re.Pattern[bytes]], ...] = (
    ("private key", re.compile(rb"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----")),
    ("certificate", re.compile(rb"-----BEGIN CERTIFICATE-----")),
    ("AWS access key", re.compile(rb"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
    ("GitHub token", re.compile(rb"\bgh[pousr]_[A-Za-z0-9]{36,}\b")),
    ("Google API key", re.compile(rb"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Slack token", re.compile(rb"\bxox[baprs]-[0-9A-Za-z-]{20,}\b")),
    ("API or service token", re.compile(rb"\bsk-[A-Za-z0-9_-]{20,}\b")),
)

ASSIGNMENT_PATTERN = re.compile(
    rb"""(?i)(?<![A-Za-z0-9])(?:api[_-]?key|client[_-]?secret|access[_-]?token|auth[_-]?token|password|secret|token|credential)\b"""
    rb"""\s*[:=]\s*["']?([A-Za-z0-9_./+=-]{12,})"""
)
PLACEHOLDER_PREFIXES = (
    b"your_",
    b"your-",
    b"example",
    b"placeholder",
    b"changeme",
    b"change_me",
    b"replace",
    b"redacted",
    b"dummy",
    b"process.env",
    b"os.getenv",
    b"${",
    b"$",
)

PRIVATE_KEY_SUFFIXES = {".key", ".p8", ".p12", ".pfx", ".jks", ".keystore"}
CERTIFICATE_SUFFIXES = {".crt", ".cer", ".der", ".p7b", ".p7c", ".p7s"}
CREDENTIAL_SUFFIXES = {".credentials", ".secret", ".secrets"}


class ScanError(RuntimeError):
    """A Git operation needed for the scan failed."""


def git(root: str, *args: str, input_bytes: bytes | None = None) -> bytes:
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=root,
            input=input_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            check=True,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        raise ScanError from error
    return result.stdout


def is_safe_example(path: str) -> bool:
    name = PurePosixPath(path).name.lower()
    return name == ".env.example" or (
        name.startswith(".env.") and name.endswith(".example")
    )


def path_categories(path: str) -> set[str]:
    if is_safe_example(path):
        return set()

    normalized = path.replace("\\", "/").lower()
    name = PurePosixPath(normalized).name
    suffix = PurePosixPath(name).suffix
    parts = set(PurePosixPath(normalized).parts)
    categories: set[str] = set()

    if (
        name == ".env"
        or name.startswith(".env.")
        or name == ".envrc"
        or name.startswith(".envrc.")
        or name in {"credentials", "credential"}
        or name.startswith(("credentials.", "credential."))
        or name.endswith(("_credentials.json", "-credentials.json"))
        or name.startswith(("service-account", "service_account"))
        or name.startswith("secrets.local")
        or name in {".pypirc", ".netrc", ".pgpass", ".my.cnf"}
        or (name.startswith(".npmrc.") and name.endswith(".local"))
        or "credentials" in parts
        or "credential" in parts
        or bool(parts & {".credentials", ".secrets", ".aws", ".ssh", ".gnupg", ".azure", ".kube"})
        or ".config/gcloud" in normalized
        or (".docker" in parts and name == "config.json")
        or name == ".tfstate"
        or ".tfstate." in name
        or suffix in CREDENTIAL_SUFFIXES
        or name.endswith((".secret", ".secrets"))
    ):
        categories.add("credential file")

    if suffix in PRIVATE_KEY_SUFFIXES or name in {
        "id_rsa",
        "id_dsa",
        "id_ecdsa",
        "id_ed25519",
    }:
        categories.add("private key file")

    if suffix in CERTIFICATE_SUFFIXES or suffix == ".pem":
        categories.add("certificate or key file")

    return categories


def content_categories(content: bytes) -> set[str]:
    categories: set[str] = set()
    for category, pattern in SECRET_PATTERNS:
        if pattern.search(content):
            categories.add(category)

    for match in ASSIGNMENT_PATTERN.finditer(content):
        value = match.group(1).lower()
        if not value.startswith(PLACEHOLDER_PREFIXES):
            categories.add("credential assignment")
            break

    return categories


def scan_file(path: str, content: bytes) -> set[str]:
    path_findings = path_categories(path)
    if not path_findings and is_safe_example(path):
        return set()
    return path_findings | content_categories(content)


def staged_files(root: str) -> Iterable[tuple[str, bytes]]:
    paths = git(root, "diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z")
    for raw_path in paths.split(b"\0"):
        if not raw_path:
            continue
        path = os.fsdecode(raw_path)
        try:
            content = git(root, "show", f":{path}")
        except ScanError as error:
            raise ScanError from error
        yield path.replace(os.sep, "/"), content


def reachable_blobs(root: str) -> Iterable[tuple[str, bytes]]:
    objects = git(root, "rev-list", "--objects", "--all")
    for entry in objects.splitlines():
        object_id, separator, raw_path = entry.partition(b" ")
        if not object_id:
            continue
        try:
            header = git(root, "cat-file", "-t", object_id.decode("ascii")).strip()
        except ScanError as error:
            raise ScanError from error
        if header != b"blob":
            continue

        path = os.fsdecode(raw_path) if separator else "(unnamed blob)"
        try:
            content = git(root, "cat-file", "blob", object_id.decode("ascii"))
        except ScanError as error:
            raise ScanError from error
        yield path.replace(os.sep, "/"), content


def find_root() -> str:
    try:
        return os.fsdecode(
            subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                check=True,
            ).stdout.strip()
        )
    except (OSError, subprocess.CalledProcessError) as error:
        raise ScanError from error


def collect_findings(root: str, scan_staged: bool, scan_history: bool) -> list[tuple[str, str]]:
    findings: set[tuple[str, str]] = set()
    sources = []
    if scan_staged:
        sources.append(staged_files(root))
    if scan_history:
        sources.append(reachable_blobs(root))

    for source in sources:
        for path, content in source:
            for category in scan_file(path, content):
                findings.add((path, category))
    return sorted(findings)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Scan staged files and reachable Git history without displaying secret values."
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--staged", action="store_true", help="scan staged changes only")
    mode.add_argument("--history", action="store_true", help="scan reachable history only")
    args = parser.parse_args(argv)

    try:
        root = find_root()
        findings = collect_findings(
            root,
            scan_staged=args.staged or not args.history,
            scan_history=args.history or not args.staged,
        )
    except ScanError:
        print("Secret scan could not complete: a required Git operation failed.", file=sys.stderr)
        return 2

    if findings:
        print("Potential credential material found (values are not displayed):")
        for path, category in findings:
            print(f" - {path} [{category}]")
        return 1

    print("Secret scan passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
