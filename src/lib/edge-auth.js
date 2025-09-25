// Edge-compatible session verification (no Node 'crypto').
// Mirrors the HMAC-SHA256 format from src/lib/auth.js:
// base64url( JSON.stringify(payload) + "|" + hex(hmacSha256(secret, data)) )

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change";

function base64UrlToString(b64url) {
  if (!b64url || typeof b64url !== "string") return "";
  const b64 = b64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(b64url.length / 4) * 4, "=");
  // atob returns a binary string; convert to Uint8Array then decode as UTF-8
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacSha256Hex(keyStr, dataStr) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(dataStr));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function verifySession(token) {
  try {
    const raw = base64UrlToString(token);
    const [data, sig] = raw.split("|");
    if (!data || !sig) return null;
    const expected = await hmacSha256Hex(SECRET, data);
    if (sig !== expected) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}
