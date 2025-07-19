import { Buffer } from "buffer";

export async function bufferFromFile(
  file: File,
  debug: boolean = false,
): Promise<Buffer> {
  if (debug) {
    console.log(
      `[bufferFromFile] Attempting to extract file data from file '${file.name}'...`,
    );
  }

  if (typeof file !== "object") {
    throw new Error(
      `Expected 'file' to have 'typeof' result equal to 'object'! Received: '${typeof file}'`,
    );
  }

  if (!(file instanceof File)) {
    throw new Error(
      `Expected input object to encode as base64url to be a 'File' instance, received value of type '${typeof file}'!`,
    );
  }

  if (
    (file.hasOwnProperty("bytes") || "bytes" in file) &&
    typeof file.bytes === "function"
  ) {
    if (debug) {
      console.log(
        "[bufferFromFile] File reference has 'bytes' method for extracting data! Attempting to use .bytes()...",
      );
    }
    return Buffer.from(await file.bytes());
  } else if (
    (file.hasOwnProperty("arrayBuffer") || "arrayBuffer" in file) &&
    typeof file.arrayBuffer === "function"
  ) {
    if (debug) {
      console.log(
        "[bufferFromFile] File reference has 'arrayBuffer' method for extracting data! Attempting to use .arrayBuffer()...",
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    if (debug) {
      console.log(
        "[bufferFromFile] Sucessfully used .arrayBuffer() to extract file data!",
      );
    }

    return Buffer.from(arrayBuffer);
  } else {
    if (debug) {
      console.log(
        "[bufferFromFile] File reference does not appear to have 'bytes' or 'arrayBuffer' methods for extracting data! Attempting to use 'FileReader' approach...",
      );
    }

    try {
      return new Promise<Buffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string" || !result) {
            reject("FileReader failed to extract data buffer from input File!");
            return;
          }
          resolve(Buffer.from(result));
          return;
        };
        reader.onerror = (e: unknown) => {
          console.error("Error reading file contents with FileReader: ", e);
          reject("Error reading file contents with FileReader!");
        };
        reader.readAsArrayBuffer(file);
      });
    } catch (e: unknown) {
      console.error(
        "Failed to read file data buffer using 'FileReader' instance: ",
        e,
      );
      throw new Error(
        "Failed to read file data buffer using 'FileReader' instance!",
      );
    }

    console.warn(
      "'File' interface does not appear to have 'bytes' or 'arrayBuffer' methods!",
    );
    throw new Error("Failed to extract file data from 'File' instance!");
  }
}

export default bufferFromFile;
