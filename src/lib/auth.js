import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change";

export function signSession(payload) {
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return Buffer.from(`${data}|${sig}`).toString("base64url");
}

export function verifySession(token) {
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const [data, sig] = raw.split("|");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(data)
      .digest("hex");
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
