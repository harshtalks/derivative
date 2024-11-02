import { base32 } from "oslo/encoding";

export function generateRandomAccessToken(): string {
  const accessCodeBytes = new Uint8Array(20);
  crypto.getRandomValues(accessCodeBytes);
  const accessToken = base32.encode(accessCodeBytes);
  return accessToken;
}
