import { createHash } from "crypto";

// generateHash generates a SHA-256 hash for the provided string and returns the first 8 characters.
export function generateHash(data: string) {
  return createHash("sha256").update(data).digest("hex").slice(0, 8);
}
