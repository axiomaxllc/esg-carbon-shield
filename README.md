# AXIOMAX ESG Carbon Shield — Public Verifier Spec

> The world's first cryptographically verifiable sustainability certification system for AI inference workloads.
> Patent Pending USPTO Application **64/081,419** (filed June 3, 2026).
> Operated by **AXIOMAX LLC**, Salinas, Puerto Rico.

---

## Why this repository exists

Every AXIOMAX ESG token is signed with ed25519 against a per-client public key. Any auditor — KPMG, Deloitte, EY, PwC, independent, journalist, regulator, competitor — can verify any AXIOMAX-issued certificate **without contacting AXIOMAX servers, without logins, without trusting us**.

This repository is the public, append-only, immutable record of:

- The **master public key** of AXIOMAX LLC (root of trust)
- The **public key** of every registered client
- The **token format specification** (JSON schema + canonicalization rules)
- **Reference verifier implementations** in Python, JavaScript, and Bash+OpenSSL
- **Test vectors** (sample valid tokens + sample tampered tokens with expected results)

Anyone, anywhere, can clone this repo and verify any AXIOMAX certificate **completely offline**. If AXIOMAX LLC ceases to exist, this repo (mirrored across GitHub clones worldwide) remains the canonical reference.

---

## Quick verification (60 seconds)

```bash
git clone https://github.com/AXIOMAX-LLC/esg-carbon-shield.git
cd esg-carbon-shield
python3 verifiers/verify.py test_vectors/sample_valid_token.json
# → ✓ VALID · client demo_client_001 · 10 inferences · 1.4935 Wh saved

python3 verifiers/verify.py test_vectors/sample_tampered_token.json
# → ✗ INVALID · signature does not match client public key
```

That's it. No login, no API key, no internet (after clone). Pure cryptography.

---

## Token format

Every AXIOMAX ESG attestation token is a JSON object with the following fields:

| Field | Type | Description |
|---|---|---|
| `v` | string | Schema version. Currently `axiomax_esg_token_v1` |
| `client_id` | string | Unique client identifier (e.g. `demo_client_001`) |
| `ts_issued_utc` | string (ISO 8601) | Time the token was signed |
| `seq_first` | int | Sequence number of first inference in batch |
| `seq_last` | int | Sequence number of last inference in batch |
| `n_inferences` | int | Total inferences in batch |
| `total_tokens` | int | Total LLM tokens (in + out) processed |
| `total_wh_saved` | float | Total energy saved versus cloud equivalent (Wh) |
| `total_liters_water_saved` | float | Total water saved (datacenter coolant equivalent) |
| `total_co2_kg_saved` | float | Total CO₂ equivalent saved (kg) |
| `first_hash` | string (hex) | SHA-256 hash of first inference record |
| `last_hash` | string (hex) | SHA-256 hash of last inference record |
| `chain_integrity_check` | bool | Server confirms internal hash chain is consistent |
| `signature_ed25519` | string (hex) | ed25519 signature over canonical JSON (without this field) |

### Canonicalization rule

To verify, remove the `signature_ed25519` field, re-serialize the remaining object with `sort_keys=True` and minimal separators (`(",", ":")`), then check the ed25519 signature over those bytes using the client's public key.

```python
import json, hashlib
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.hazmat.primitives import serialization

token = json.load(open("token.json"))
sig_hex = token.pop("signature_ed25519")
canonical = json.dumps(token, sort_keys=True, separators=(",", ":")).encode("utf-8")
pub = serialization.load_pem_public_key(open("client_public.pem", "rb").read())
pub.verify(bytes.fromhex(sig_hex), canonical)  # raises if invalid
```

---

## Public keys directory

Every AXIOMAX client has a unique ed25519 keypair. The **private** key is stored exclusively on AXIOMAX's secured infrastructure (never on client devices, never transmitted). The **public** key is published in this repository under `public_keys/{client_id}.pub.pem`.

- `public_keys/axiomax_master.pub.pem` — AXIOMAX root of trust
- `public_keys/{client_id}.pub.pem` — one file per registered client

Auditor workflow: receive a token JSON from a client, look up `client_id` field, fetch the matching `.pub.pem` file from this repository, verify signature locally.

---

## Reference verifier implementations

Three reference implementations are provided. All produce identical results.

| Verifier | Language | Path | Use case |
|---|---|---|---|
| `verify.py` | Python 3.10+ | `verifiers/verify.py` | Server, scripts, automation |
| `verify.js` | JavaScript (browser + Node) | `verifiers/verify.js` | Web apps, browser extensions |
| `verify.sh` | Bash + OpenSSL | `verifiers/verify.sh` | Air-gapped audit environments |

All three implement the same algorithm. Output format is identical.

---

## Token expiration and revocation

ESG tokens have no built-in expiration. They are valid forever (cryptographic signatures don't expire). If AXIOMAX needs to invalidate a client (e.g. fraud, contract termination), the client's public key is moved to `public_keys/_revoked/`. Auditors should check the active `public_keys/` directory at verification time.

---

## Hash chain integrity

Each inference record contains a `prev_hash` field linking it to the previous record. The token's `first_hash` and `last_hash` anchor the chain. For full chain verification (beyond the token batch), request the per-inference log from the client (it lives on their hardware).

Tampering with any inference value breaks the chain and is detectable.

---

## Patent notice

The system described by this specification is protected by US Patent and Trademark Office Provisional Application **64/081,419**, titled *"Method and System for Cryptographically Attested Sustainability Reporting of On-Device Artificial Intelligence Inference"*. Filed June 3, 2026. Inventor: **Charles Santana**. Assignee: **AXIOMAX LLC**, Salinas, Puerto Rico, USA.

This repository is published for verification purposes only. Use of the AXIOMAX ESG Carbon Shield system, brand, or claim of operating equivalent technology requires a commercial license from AXIOMAX LLC.

---

## License (this repository only)

The reference verifier code in this repository is released under MIT License. The AXIOMAX ESG Carbon Shield system architecture, calibration coefficients, and brand are proprietary to AXIOMAX LLC.

---

## Contact

- **Website:** https://axiomaxllc.com
- **Verifier (hosted):** https://verify.axiomaxllc.com
- **Email:** charles@axiomaxllc.com
- **HQ:** AXIOMAX LLC, La Margarita LL F34, Salinas, Puerto Rico 00751, USA
- **LinkedIn:** /in/charlessantana
