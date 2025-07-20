import bufferFromFile from "./fileToBuffer";
import { Buffer } from "buffer";

export async function serializeFile<SerializedFileType = string>(
  file: File,
  serializeFromBuffer: (buf: Buffer, debug: boolean) => SerializedFileType,
  debug: boolean = false,
): Promise<SerializedFileType> {
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

  try {
    return serializeFromBuffer(file_buffer satisfies Buffer, debug);
  } catch (e: unknown) {
    console.error(`Failed to encode input file '${file.name}' into: `, e);
    throw new Error(
      `Failed to encode input file '${file.name}' as 'base64url'!`,
    );
  }
}

export default serializeFile;
