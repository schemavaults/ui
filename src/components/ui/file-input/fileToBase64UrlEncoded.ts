import bufferFromFile from "./fileToBuffer";
import { Buffer } from "buffer";

export async function fileToBase64UrlEncoded(
  file: File,
  bufferToBase64Url: (buf: Buffer, debug: boolean) => string,
  debug: boolean = false,
): Promise<string> {
  if (debug) {
    console.log(
      `[fileToBase64UrlEncoded] Attempting to extract buffer from file '${file.name}'...`,
    );
  }

  let file_buffer: Buffer;
  try {
    file_buffer = await bufferFromFile(file, debug);
  } catch (e: unknown) {
    console.error(
      `[fileToBase64UrlEncoded] Failed to load input file '${file.name}' into data buffer: `,
      e,
    );
    throw new Error(
      `Failed to load input file '${file.name}' into data buffer!`,
    );
  }

  if (debug) {
    console.log(
      `[fileToBase64UrlEncoded] Successfully loaded file data into buffer! Size: '${file_buffer.length} bytes'`,
    );
  }

  let base64url_str: string;
  try {
    base64url_str = bufferToBase64Url(file_buffer, debug);
  } catch (e: unknown) {
    console.error(
      `Failed to encode input file '${file.name}' as 'base64url': `,
      e,
    );
    throw new Error(
      `Failed to encode input file '${file.name}' as 'base64url'!`,
    );
  }
  return base64url_str;
}

export default fileToBase64UrlEncoded;
