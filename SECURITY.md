# Security Policy

AXIOMAX LLC takes the security of AXIOMAX ESG Carbon Shield seriously.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in the AXIOMAX ESG Carbon Shield protocol, reference verifier implementations, or any part of the public infrastructure (verify.axiomaxllc.com, cliente.axiomaxllc.com, calc.axiomaxllc.com, axiomaxllc.com), please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

Email: **security@axiomaxllc.com**

PGP key (optional): published at [https://axiomaxllc.com/.well-known/security.txt](https://axiomaxllc.com/.well-known/security.txt)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested mitigation (if available)
- Your contact information (for follow-up and credit)

### What to Expect

- **Acknowledgment within 24 hours** of receipt
- **Initial assessment within 72 hours**
- **Coordinated disclosure** following responsible disclosure principles
- **Public credit** in our Security Hall of Fame (unless you prefer to remain anonymous)
- **Bug bounty** for verified critical findings (case-by-case basis)

## Scope

### In scope
- Cryptographic protocol vulnerabilities (signature forgery, hash collisions, canonicalization bypass)
- Reference verifier implementations bugs leading to incorrect VALID/INVALID results
- Public infrastructure (verify, cliente, calc, axiomaxllc.com) security issues
- Authentication or authorization bypass in dashboards
- Privacy leaks from public endpoints

### Out of scope
- Issues requiring physical access to client hardware
- Social engineering of AXIOMAX staff
- Denial of Service attacks on public infrastructure
- Issues in third-party services we depend on (Cloudflare, GitHub Pages, Hetzner)
- Self-XSS or issues requiring user interaction with malicious content from a different origin

## Cryptographic Foundations

AXIOMAX ESG Carbon Shield relies on:

- **ed25519** for digital signatures (RFC 8032)
- **SHA-256** for hash chaining (FIPS 180-4)
- **Argon2id** for passphrase-derived keys (RFC 9106)
- **AES-256-GCM** for at-rest encryption (NIST SP 800-38D)
- **LUKS2** for full-volume encryption at rest

Any successful attack on these primitives at the protocol level would qualify as a Critical finding.

## Patent Pending

The system is protected by USPTO Patent Pending Application 64/081,419 (filed June 3, 2026). Security research is welcomed and encouraged. Commercial exploitation of identified vulnerabilities (e.g., building a competing product based on disclosed information) remains subject to the patent.

## Recognition

We commit to publicly recognizing security researchers who report verified vulnerabilities in good faith.

— AXIOMAX LLC
Salinas, Puerto Rico
