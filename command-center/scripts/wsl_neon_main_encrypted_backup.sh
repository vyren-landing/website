#!/usr/bin/env bash
# Command Center: delegate to the EXISTING approved WSL backup engine.
# The user's established workflow uses vyren_backup_ro and GPG recipient encryption.
# Do not build a parallel Neon owner-password backup process.
set -Eeuo pipefail
engine="$HOME/.local/bin/vyren-cc-backup.sh"
if [[ ! -x "$engine" ]]; then
  printf 'Existing WSL backup engine missing or not executable: %s\n' "$engine" >&2
  exit 1
fi
exec "$engine"
