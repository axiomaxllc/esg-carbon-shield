#!/bin/bash
#
# AXIOMAX ESG Carbon Shield — Reference Verifier (Bash + OpenSSL)
#
# Verifies any AXIOMAX ESG token using its client's published public key.
# Completely offline. Requires only OpenSSL (no Python, no Node).
#
# USAGE:
#   ./verify.sh <token.json> [public_key.pem]
#
# EXIT CODES:
#   0 — VALID
#   1 — INVALID
#   2 — usage error
#
set -euo pipefail

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
    echo "Usage: $0 <token.json> [public_key.pem]"
    exit 2
fi

TOKEN_FILE="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

CLIENT_ID=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['client_id'])" "$TOKEN_FILE")
PUBKEY_FILE="${2:-$SCRIPT_DIR/../public_keys/${CLIENT_ID}.pub.pem}"

if [ ! -f "$PUBKEY_FILE" ]; then
    echo "✗ INVALID · public key not found: $PUBKEY_FILE"
    exit 1
fi

# Extract signature hex + build canonical JSON without it
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

python3 - "$TOKEN_FILE" "$TMP_DIR" <<'PY'
import json, sys
t = json.load(open(sys.argv[1]))
sig = t.pop("signature_ed25519")
canonical = json.dumps(t, sort_keys=True, separators=(",", ":")).encode("utf-8")
open(sys.argv[2] + "/canonical.bin", "wb").write(canonical)
open(sys.argv[2] + "/sig.hex", "w").write(sig)
PY

xxd -r -p "$TMP_DIR/sig.hex" > "$TMP_DIR/sig.bin"

if openssl pkeyutl -verify -pubin -inkey "$PUBKEY_FILE" \
   -rawin -in "$TMP_DIR/canonical.bin" -sigfile "$TMP_DIR/sig.bin" 2>/dev/null | grep -q "Successfully Verified"; then
    META=$(python3 -c "import json,sys; t=json.load(open(sys.argv[1])); print(f\"{t['n_inferences']} inferences · {t['total_wh_saved']} Wh saved · {t.get('total_co2_kg_saved',0)*1000:.4f} g CO2 saved\")" "$TOKEN_FILE")
    echo "✓ VALID · client $CLIENT_ID · $META"
    exit 0
else
    echo "✗ INVALID · signature does not match client public key"
    exit 1
fi
