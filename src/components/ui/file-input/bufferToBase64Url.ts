import base64url from "base64url";
import { Buffer } from "buffer";

export function bufferToBase64Url(
  buffer: Buffer,
  debug: boolean = false,
): string {
  if (debug) {
    console.log(
      `[bufferToBase64Url] Attempting to encode buffer of size '${buffer.length}' into base64url...`,
    );
  }

  try {
    return buffer.toString("base64url");
  } catch (e: unknown) {}

  try {
    return base64url.encode(buffer);
  } catch (e: unknown) {
    console.error(
      "Failed to use 'base64url' package to encode data buffer!",
      e,
    );
  }

  throw new Error("Failed to encode data buffer as base64url!");
}

export default bufferToBase64Url;
