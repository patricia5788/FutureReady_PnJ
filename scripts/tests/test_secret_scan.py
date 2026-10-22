import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCANNER_PATH = Path(__file__).parents[1] / "secret_scan.py"
SPEC = importlib.util.spec_from_file_location("secret_scan", SCANNER_PATH)
assert SPEC is not None and SPEC.loader is not None
secret_scan = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = secret_scan
SPEC.loader.exec_module(secret_scan)


class SecretScanTests(unittest.TestCase):
    def test_safe_environment_examples_are_exempt(self):
        synthetic_key = b"AK" + b"IA" + b"C" * 16
        self.assertEqual(
            secret_scan.scan_file(".env.example", b"API_KEY=" + synthetic_key),
            set(),
        )
        self.assertEqual(
            secret_scan.scan_file(".env.development.example", b"PASSWORD=placeholder"),
            set(),
        )

    def test_private_key_and_certificate_markers_are_detected(self):
        private_key_marker = b"-" * 5 + b"BEGIN RSA " + b"PRIVATE KEY" + b"-" * 5
        certificate_marker = b"-" * 5 + b"BEGIN " + b"CERTIFICATE" + b"-" * 5
        self.assertIn("private key", secret_scan.content_categories(private_key_marker))
        self.assertIn("certificate", secret_scan.content_categories(certificate_marker))

    def test_credentials_in_content_are_reported_by_category_only(self):
        synthetic_key = b"AK" + b"IA" + b"A" * 16
        categories = secret_scan.scan_file("config.txt", b"AWS_ACCESS_KEY=" + synthetic_key)
        self.assertIn("AWS access key", categories)

        token = b"rpa_" + b"Z" * 32
        token_categories = secret_scan.scan_file("config.txt", b"NPM_TOKEN=" + token)
        self.assertIn("credential assignment", token_categories)

    def test_credential_file_names_are_reported(self):
        categories = secret_scan.scan_file("config/service-account-prod.json", b"{}")
        self.assertIn("credential file", categories)
        cloud_credentials = secret_scan.scan_file(".aws/credentials", b"profile=default")
        self.assertIn("credential file", cloud_credentials)
        self.assertEqual(secret_scan.path_categories(".npmrc"), set())
        self.assertIn("credential file", secret_scan.path_categories(".npmrc.local"))

    def test_staged_scanner_finds_credentials_without_printing_values(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            self._init_repo(root)
            synthetic_key = b"AK" + b"IA" + b"B" * 16
            (root / "settings.txt").write_bytes(b"key=" + synthetic_key)
            self._git(root, "add", "settings.txt")

            findings = secret_scan.collect_findings(str(root), True, False)

            self.assertEqual(findings, [("settings.txt", "AWS access key")])

    def test_cli_reports_category_without_printing_credential_value(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            self._init_repo(root)
            synthetic_key = b"AK" + b"IA" + b"D" * 16
            (root / "settings.txt").write_bytes(b"key=" + synthetic_key)
            self._git(root, "add", "settings.txt")

            result = subprocess.run(
                [sys.executable, str(SCANNER_PATH), "--staged"],
                cwd=root,
                capture_output=True,
                check=False,
            )

            self.assertEqual(result.returncode, 1)
            self.assertIn(b"settings.txt [AWS access key]", result.stdout)
            self.assertNotIn(synthetic_key, result.stdout + result.stderr)

    def test_reachable_history_includes_removed_credential_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            self._init_repo(root)
            (root / "credentials.json").write_text('{"example": true}\n')
            self._git(root, "add", "credentials.json")
            self._git(root, "commit", "-m", "add temporary credential file")
            (root / "credentials.json").unlink()
            self._git(root, "add", "-u")
            self._git(root, "commit", "-m", "remove temporary credential file")

            findings = secret_scan.collect_findings(str(root), False, True)

            self.assertIn(("credentials.json", "credential file"), findings)

    @staticmethod
    def _git(root: Path, *args: str) -> None:
        subprocess.run(["git", *args], cwd=root, check=True, capture_output=True)

    @classmethod
    def _init_repo(cls, root: Path) -> None:
        cls._git(root, "init", "-q")
        cls._git(root, "config", "user.email", "scanner-test@example.invalid")
        cls._git(root, "config", "user.name", "Secret Scanner Test")


if __name__ == "__main__":
    unittest.main()
