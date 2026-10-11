#!/usr/bin/env bash
# VYREN Command Center: encrypted read-only backup from Neon main.
# Run interactively in the user's own WSL; credentials never belong in Git.
set -Eeuo pipefail
umask 077
for command_name in pg_dump psql pg_restore gpg sha256sum; do
  command -v "$command_name" >/dev/null || { printf 'Missing command: %s\n' "$command_name" >&2; exit 1; }
done

printf '%s\n' 'VYREN Command Center | Neon main | encrypted backup (read-only)'
printf '%s\n' 'Use the DIRECT (not -pooler) host from Neon > main > Connect.'
read -r -p 'Main direct PGHOST (hostname only, no URL/password): ' PGHOST </dev/tty
if [[ -z "$PGHOST" || "$PGHOST" == *-pooler* || "$PGHOST" == *://* || "$PGHOST" == *@* || "$PGHOST" == *' '* ]]; then
  printf '%s\n' 'Invalid or pooled PGHOST; no backup attempted.' >&2
  exit 1
fi
read -r -p 'Confirm selected Neon branch is main (type main): ' confirm </dev/tty
[[ "$confirm" == main ]] || { printf '%s\n' 'Canceled. Source branch not confirmed.' >&2; exit 1; }

export PGHOST PGPORT=5432 PGUSER=neondb_owner PGDATABASE=neondb PGSSLMODE=require
export GPG_TTY="$(tty)"
read -r -s -p 'Neon database password (hidden): ' PGPASSWORD </dev/tty
printf '\n'
export PGPASSWORD
trap 'unset PGPASSWORD' EXIT
identity="$(psql -X -w -A -t -c "SELECT current_database() || '|' || current_user")"
[[ "$identity" == 'neondb|neondb_owner' ]] || { printf 'Unexpected source identity, aborting: %s\n' "$identity" >&2; exit 1; }

expected_tables='user,session,account,verification,cc_members,cc_tasks,cc_deliverables,cc_reviews,cc_audit,cc_team_invites,cc_project_records,cc_project_record_events,cc_workstreams,cc_workstream_events,cc_opportunities,cc_opportunity_events,cc_projects,cc_project_events'
present="$(psql -X -w -A -t -c "SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname='public' AND tablename=ANY(string_to_array('$expected_tables',','))")"
[[ "$present" == '18' ]] || { printf 'Expected 18 public tables; found %s. No backup attempted.\n' "$present" >&2; exit 1; }
printf '%s\n' 'Source preflight PASS: neondb / neondb_owner / 18 known tables.'

backup_dir="$HOME/vyren_secure_backups"
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"
backup="$backup_dir/VYREN_CC_main_$(date +%Y%m%d_%H%M%S).dump.gpg"
[[ ! -e "$backup" ]] || { printf '%s\n' 'Refusing to overwrite an existing encrypted backup.' >&2; exit 1; }

# Pipefail ensures dump failures do not appear successful just because GPG exits 0.
if ! (pg_dump --format=custom --no-password | gpg --pinentry-mode loopback --symmetric --cipher-algo AES256 --output "$backup"); then
  rm -f -- "$backup"
  printf '%s\n' 'BACKUP_FAILED (partial encrypted output deleted; previous backups intact).' >&2
  exit 1
fi
unset PGPASSWORD
[[ -s "$backup" ]] || { printf '%s\n' 'Encrypted backup is empty.' >&2; exit 1; }

# Decryption stays in a pipe; no decrypted data or archive is written to disk.
toc="$(gpg --decrypt "$backup" | pg_restore --list)"
for table_name in ${expected_tables//,/ }; do
  if ! grep -Fq "TABLE DATA public $table_name " <<< "$toc"; then
    printf 'Required TABLE DATA entry missing from dump: %s\n' "$table_name" >&2
    exit 1
  fi
done
printf '%s\n' 'BACKUP_CREATED; ARCHIVE_READ_OK; 18_REQUIRED_TABLE_DATA_ENTRIES_PRESENT'
printf 'File: %s\n' "$backup"
stat -c 'Encrypted file size: %s bytes' -- "$backup"
sha256sum -- "$backup"
printf '%s\n' 'Not yet verified by pg_restore into an isolated database.'
