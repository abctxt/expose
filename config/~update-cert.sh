#!/usr/bin/env zsh
#
# Template: copy to update-cert.sh and set the paths below for your host.
#
# acme.sh stores issued files under a per-certificate directory, for example:
#   /path/to/acme-out/example.com_ecc/
#   /path/to/acme-out/*.example.com_ecc/   (wildcard; * is part of the directory name)
#
# Inside that directory, typical filenames are:
#   fullchain.cer
#   example.com.key
#   *.example.com.key                      (wildcard; * is part of the filename)

set -euo pipefail

ACME_DIR=/path/to/acme-out/example.com_ecc
TARGET_DIR=${0:a:h}

CERT_SRC="$ACME_DIR/fullchain.cer"
KEY_SRC="$ACME_DIR/example.com.key"

CERT_TARGETS=("$TARGET_DIR/kestrel-cert.pem" "$TARGET_DIR/nginx-cert.pem")
KEY_TARGETS=("$TARGET_DIR/kestrel-key.pem" "$TARGET_DIR/nginx-key.pem")

function complain() {
  echo "ERROR: $1" >&2
  exit 1
}

function ensure_file() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    complain "Required file not found: $file"
  fi
}

function copy_file() {
  local src="$1" dst="$2"
  echo "Copying $src -> $dst"
  cp -f "$src" "$dst"
}

function set_permissions() {
  local file="$1" mode="$2"
  chmod "$mode" "$file"
}

if [[ ! -d "$ACME_DIR" ]]; then
  complain "ACME certificate directory not found: $ACME_DIR"
fi

ensure_file "$CERT_SRC"
ensure_file "$KEY_SRC"

for dst in "${CERT_TARGETS[@]}"; do
  copy_file "$CERT_SRC" "$dst"
  set_permissions "$dst" 644
done

for dst in "${KEY_TARGETS[@]}"; do
  copy_file "$KEY_SRC" "$dst"
  set_permissions "$dst" 600
done

echo "Certificate files updated successfully from: $ACME_DIR"
