/**
 * AXIOMAX ESG Carbon Shield — Reference Verifier (JavaScript)
 *
 * Works in browser (Web Crypto API) and Node.js (crypto module).
 * Completely offline once you have the public key.
 *
 * USAGE (Node):
 *   node verify.js <token.json> [public_key.pem]
 *
 * USAGE (browser):
 *   import { verifyToken } from './verify.js';
 *   const result = await verifyToken(tokenObj, publicKeyPem);
 */

const isNode = typeof window === 'undefined';

function canonicalize(obj) {
  // JSON with sorted keys + minimal separators (matches Python json.dumps sort_keys=True separators=(",", ":"))
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalize(obj[k])).join(',') + '}';
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function pemToBinary(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  if (isNode) {
    return Buffer.from(b64, 'base64');
  }
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function verifyToken(token, publicKeyPem) {
  const required = ["v", "client_id", "signature_ed25519", "first_hash", "last_hash",
                    "n_inferences", "total_wh_saved", "seq_first", "seq_last"];
  for (const k of required) {
    if (!(k in token)) return { valid: false, reason: `missing field: ${k}` };
  }

  const sigHex = token.signature_ed25519;
  const tokenCopy = { ...token };
  delete tokenCopy.signature_ed25519;
  const canonical = canonicalize(tokenCopy);
  const sigBytes = hexToBytes(sigHex);
  const msgBytes = new TextEncoder().encode(canonical);
  const keyBytes = pemToBinary(publicKeyPem);

  if (isNode) {
    const { createPublicKey, verify } = await import('node:crypto');
    const key = createPublicKey({ key: Buffer.from(keyBytes), format: 'der', type: 'spki' });
    const ok = verify(null, msgBytes, key, sigBytes);
    return ok
      ? { valid: true, client_id: token.client_id, n_inferences: token.n_inferences,
          total_wh_saved: token.total_wh_saved, total_co2_kg_saved: token.total_co2_kg_saved }
      : { valid: false, reason: "signature does not match client public key" };
  } else {
    // Browser Web Crypto API
    const key = await crypto.subtle.importKey('spki', keyBytes, { name: 'Ed25519' }, false, ['verify']);
    const ok = await crypto.subtle.verify('Ed25519', key, sigBytes, msgBytes);
    return ok
      ? { valid: true, client_id: token.client_id, n_inferences: token.n_inferences,
          total_wh_saved: token.total_wh_saved, total_co2_kg_saved: token.total_co2_kg_saved }
      : { valid: false, reason: "signature does not match client public key" };
  }
}

// CLI entry point
if (isNode && import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const tokenPath = process.argv[2];
  if (!tokenPath) {
    console.error("Usage: node verify.js <token.json> [public_key.pem]");
    process.exit(2);
  }
  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const pubPath = process.argv[3] ||
    path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public_keys', `${token.client_id}.pub.pem`);
  if (!fs.existsSync(pubPath)) {
    console.error(`✗ INVALID · public key not found: ${pubPath}`);
    process.exit(1);
  }
  const pubPem = fs.readFileSync(pubPath, 'utf-8');
  const result = await verifyToken(token, pubPem);
  if (result.valid) {
    console.log(`✓ VALID · client ${result.client_id} · ${result.n_inferences} inferences · ${result.total_wh_saved} Wh saved`);
    process.exit(0);
  } else {
    console.log(`✗ INVALID · ${result.reason}`);
    process.exit(1);
  }
}
