# Secret scanning

Before pushing changes, run the repository's secret scanner from the project root:

```sh
python3 scripts/secret_scan.py
```

The default scan checks staged changes and all Git history reachable from local and remote-tracking refs. It exits with a nonzero status when it finds potential credentials. Findings include only the file path and category; credential values are never printed.

Safe environment templates such as `.env.example` and `.env.development.example` are excluded. Keep real credentials out of templates and Git history. If a finding is valid, remove the credential and rotate it; removing it from the latest file does not remove it from reachable history.

To run only one part of the scan, use `--staged` or `--history`. Scanner tests can be run with:

```sh
python3 -m unittest discover -s scripts/tests
```
