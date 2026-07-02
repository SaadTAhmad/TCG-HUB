import crypto from "crypto";

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

function getKey() {
  const raw = process.env.PROFILE_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("PROFILE_ENCRYPTION_KEY is not configured.");
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("PROFILE_ENCRYPTION_KEY must be a 32-byte base64 value.");
  }

  return key;
}

export function encryptJson(value: unknown): EncryptedPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  };
}

export function decryptJson<T>(payload: EncryptedPayload): T {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(payload.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "base64")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as T;
}
