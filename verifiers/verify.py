#!/usr/bin/env python3
"""
AXIOMAX ESG Carbon Shield — Reference Verifier (Python).

Verifies any AXIOMAX ESG attestation token using its client's published public key.
Completely offline. No AXIOMAX server required.

USAGE:
    python3 verify.py <token.json> [public_key.pem]

If public_key.pem is omitted, the script looks for `../public_keys/{client_id}.pub.pem`.

EXIT CODES:
    0 — VALID
    1 — INVALID signature or tampered
    2 — usage error or missing file

REQUIRES:
    pip install cryptography
"""
import json
import sys
import os
from pathlib import Path

try:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
    from cryptography.hazmat.primitives import serialization
    from cryptography.exceptions import InvalidSignature
except ImportError:
    print("ERROR: pip install cryptography", file=sys.stderr)
    sys.exit(2)


def verify_token(token_path: str, pubkey_path: str = None) -> dict:
    """Verify an AXIOMAX ESG token. Returns dict with verification result."""
    with open(token_path) as f:
        token = json.load(f)

    required = ["v", "client_id", "signature_ed25519", "first_hash", "last_hash",
                "n_inferences", "total_wh_saved", "seq_first", "seq_last"]
    for k in required:
        if k not in token:
            return {"valid": False, "reason": f"missing field: {k}"}

    client_id = token["client_id"]

    if pubkey_path is None:
        script_dir = Path(__file__).resolve().parent
        pubkey_path = script_dir.parent / "public_keys" / f"{client_id}.pub.pem"

    if not Path(pubkey_path).exists():
        return {"valid": False, "reason": f"client public key not found: {pubkey_path}"}

    with open(pubkey_path, "rb") as f:
        pub_key = serialization.load_pem_public_key(f.read())

    if not isinstance(pub_key, Ed25519PublicKey):
        return {"valid": False, "reason": "client public key is not ed25519"}

    signature_hex = token.pop("signature_ed25519")
    canonical = json.dumps(token, sort_keys=True, separators=(",", ":")).encode("utf-8")
    token["signature_ed25519"] = signature_hex

    try:
        pub_key.verify(bytes.fromhex(signature_hex), canonical)
    except InvalidSignature:
        return {"valid": False, "reason": "signature does not match client public key"}
    except Exception as e:
        return {"valid": False, "reason": f"signature verification error: {e}"}

    return {
        "valid": True,
        "client_id": client_id,
        "n_inferences": token["n_inferences"],
        "total_tokens": token.get("total_tokens"),
        "total_wh_saved": token["total_wh_saved"],
        "total_liters_water_saved": token.get("total_liters_water_saved"),
        "total_co2_kg_saved": token.get("total_co2_kg_saved"),
        "ts_issued_utc": token.get("ts_issued_utc"),
        "seq_first": token["seq_first"],
        "seq_last": token["seq_last"],
    }


def main():
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print(__doc__)
        sys.exit(2)

    token_path = sys.argv[1]
    pubkey_path = sys.argv[2] if len(sys.argv) > 2 else None
    result = verify_token(token_path, pubkey_path)

    if result["valid"]:
        print(f"✓ VALID · client {result['client_id']} · "
              f"{result['n_inferences']} inferences · "
              f"{result['total_wh_saved']} Wh saved · "
              f"{result.get('total_co2_kg_saved', 0)*1000:.4f} g CO₂ saved")
        sys.exit(0)
    else:
        print(f"✗ INVALID · {result['reason']}")
        sys.exit(1)


if __name__ == "__main__":
    main()
