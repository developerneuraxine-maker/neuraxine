import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    console.warn("[auth] JWT_SECRET not set — using insecure dev secret. Set JWT_SECRET before deploying.");
    return "dev-only-secret-CHANGE-BEFORE-DEPLOY";
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { adminId: string; email: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "24h" });
}

export function verifyToken(token: string): { adminId: string; email: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { adminId: string; email: string };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] Token verification failed:", (err as Error).message);
    }
    return null;
  }
}
