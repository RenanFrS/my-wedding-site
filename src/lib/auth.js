const SECRET = process.env.ADMIN_SECRET || "dev-secret-change";

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
  for (let i = 0; i < bytes.length; i++)
    hex += bytes[i].toString(16).padStart(2, "0");
  return hex;
}

export async function signSession(payload) {
  const data = JSON.stringify(payload);
  const sig = await hmacSha256Hex(SECRET, data);
  return Buffer.from(`${data}|${sig}`).toString("base64url");
}

export async function verifySession(token) {
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const [data, sig] = raw.split("|");
    const expected = await hmacSha256Hex(SECRET, data);
    if (sig !== expected) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function credentialsAreValid(user, pass) {
  return (
    user === (process.env.ADMIN_USER || "admin") &&
    pass === (process.env.ADMIN_PASS || "admin")
  );
}
