# AXIOMAX ESG Carbon Shield

> **Cryptographically verifiable AI sustainability attestation.**
> The first commercially viable system for proving AI inference carbon footprint with mathematical certainty.

[![PyPI version](https://img.shields.io/pypi/v/axiomax-esg-sdk.svg)](https://pypi.org/project/axiomax-esg-sdk/)
[![NPM version](https://img.shields.io/npm/v/axiomax-esg-sdk-client.svg)](https://www.npmjs.com/package/axiomax-esg-sdk-client)
[![Docker Pulls](https://img.shields.io/docker/pulls/axiomax/esg-shield-emisor.svg)](https://hub.docker.com/r/axiomax/esg-shield-emisor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Patent Pending USPTO](https://img.shields.io/badge/Patent_Pending-USPTO%2064%2F081%2C419%20%2B%207%20more-blue.svg)](https://axiomaxllc.com)

## What it does

Every AI inference call your company makes gets cryptographically signed using ed25519 (RFC 8032) over a SHA-256 hash chain (FIPS 180-4). Anyone can verify any token publicly at https://verify.axiomaxllc.com without authentication.

This means:
- **CSO/CFO** gets auditor-grade evidence for CSRD/SEC/SB-253 disclosures
- **Auditors** (KPMG/Deloitte/EY/PWC) can verify ESG claims mathematically
- **Regulators** can detect greenwashing through cryptographic verification
- **Journalists** can fact-check corporate sustainability reports independently

## Quick start

### Python

```bash
pip install axiomax-esg-sdk
```

```python
from axiomax_esg_sdk import wrap_openai
import openai

client = wrap_openai(
    openai.OpenAI(api_key="sk-..."),
    license_key="axe_lic.xyz123..."
)

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### Node.js

```bash
npm install axiomax-esg-sdk-client
```

```javascript
import { wrapOpenAI } from 'axiomax-esg-sdk-client';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: 'sk-...' });
const wrapped = wrapOpenAI(openai, { licenseKey: 'axe_lic.xyz123...' });

const response = await wrapped.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

### Docker (on-premise deployment)

```bash
docker run -p 8888:8888 \
  -e AXIOMAX_LICENSE_KEY=axe_lic.xyz123... \
  axiomax/esg-shield-emisor:1.0.0
```

Image: https://hub.docker.com/r/axiomax/esg-shield-emisor

## Get a license

Sign up at https://signup.axiomaxllc.com — free trial available.

Three tiers:
- **Lite** ($6K/yr): 100K inferences/month, shared verifier
- **Hybrid** ($60K-$240K/yr): SDK + partial AXIOMAX MIND brain
- **Enterprise** ($480K-$960K/yr): Full on-premise AXIOMAX MIND brain

## Public verification

Anyone can verify any AXIOMAX token at https://verify.axiomaxllc.com:

```bash
curl -X POST https://verify.axiomaxllc.com/v1/verify \
  -d @your_token.json
```

## Patent portfolio (8 USPTO total)

A defensive thicket protecting the architecture:

| Patent | App # | Coverage |
|--------|-------|----------|
| Foundational | 64/081,419 | ed25519 + SHA-256 + public verification |
| Cryptographic Variants | 64/084,898 | 8 alternative signature primitives + 4 hash chain architectures |
| Verification Variants | 64/084,910 | 8 distributed verification architectures |
| Translation Bridge | 64/078,986 | 5 invenciones bundle |
| TB-001 to TB-004 | 64/054,375, 64/054,860, 64/060,460, 64/061,675 | Related infrastructure |

## Documentation

- [Full Documentation](https://axiomaxllc.com/docs)
- [Pricing](https://axiomaxllc.com/pricing)
- [Security & Trust](https://axiomaxllc.com/security)
- [FAQ](https://axiomaxllc.com/faq)

## License

MIT for the SDK. See [LICENSE](LICENSE).

Trade-secret calibration coefficients and master cryptographic keys are server-side only.

## Contact

- Website: https://axiomaxllc.com
- Email: contact@axiomaxllc.com
- GitHub Issues: https://github.com/axiomaxllc/esg-carbon-shield/issues

---

Built with care in Salinas, Puerto Rico by Charles Santana and cofounders.

Patent Pending USPTO 64/081,419, 64/084,898, 64/084,910 + 5 earlier patents.
