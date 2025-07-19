"use client";

import { useDoesFilenameHaveValidFileExtension } from "./useDoesFilenameHaveValidFileExtension";
import fileToBase64UrlEncoded from "./fileToBase64UrlEncoded";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMemo, type ChangeEvent, type ReactElement } from "react";

export interface FileInputProps {
  id: string;
  disabled?: boolean;
  onBlur?: () => void;
  setValue: (base64url_str: string) => void;
  expectedFileExtensions?: readonly `.${string}`[];
  debug?: boolean;
  bufferToBase64Url: (buf: Buffer, debug?: boolean) => string;
}

/**
 *
 * @param param0 FileInputProps
 * @returns FileInput component. Calls 'setValue' with the selected file
 */
export function FileInput({
  id,
  disabled,
  onBlur,
  setValue,
  bufferToBase64Url,
  ...props
}: FileInputProps): ReactElement {
  const debug: boolean = props.debug ?? false;
  const { toast } = useToast();

  const hasValidFileExtensionsExplicitlyDefined: boolean =
    useMemo((): boolean => {
      return (
        Array.isArray(props.expectedFileExtensions) &&
        props.expectedFileExtensions.length >= 1
      );
    }, [props.expectedFileExtensions]);

  const doesFilenameHaveValidFileExtension =
    useDoesFilenameHaveValidFileExtension({
      expectedFileExtensions: props.expectedFileExtensions,
    });

  return (
    <div className="w-full p-2">
      <Input
        id={id}
        type="file"
        disabled={disabled}
        onBlur={onBlur}
        onChange={async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
          if (debug) {
            console.log("[FileInput] onChange()");
          }

          const files = e.target.files;
          if (!files || !(files instanceof FileList)) {
            toast({
              variant: "destructive",
              title: "Failed to parse data from file input",
              description: "Event did not contain a files list.",
            });
            return;
          }
          if (files.length < 1) {
            toast({
              variant: "destructive",
              title: "Failed to parse data from file input",
              description: "Expected at least one file in the files list",
            });
            return;
          }

          const file = files[0];
          if (!file) {
            throw new Error("Expected at least one file, index 0 is null");
          }
          console.assert(
            !!file,
            file instanceof File,
            "Expected 'file' to be truthy and an instance of 'File' if this point was reached!",
          );
          const filename = file.name;
          if (hasValidFileExtensionsExplicitlyDefined) {
            if (debug) {
              console.log(
                "[FileInput] Validating that uploaded file meets explicitly defined file extension requirements: ",
                props.expectedFileExtensions,
              );
            }

            if (!Array.isArray(props.expectedFileExtensions)) {
              throw new Error(
                "Expected at least 1 valid file extension to have been defined if this point was reached!",
              );
            }
            const exts: readonly string[] = props.expectedFileExtensions;
            if (!doesFilenameHaveValidFileExtension(filename)) {
              const errMsg: string =
                exts.length === 1
                  ? `Expected file name to end in: '${exts[0]}'`
                  : `Expected file name to end in one of: ${exts.map((ext) => `'${ext}'`).join(",")}`;
              throw new Error(errMsg);
            }
          }

          if (typeof bufferToBase64Url !== "function") {
            throw new Error(
              "FileInput component expected to receive a 'bufferToBase64Url' function!",
            );
          }

          if (debug) {
            console.log(
              `[FileInput] Attempting to base64url-encode file '${file.name}'...`,
            );
          }

          let base64url_encoded: string;
          try {
            base64url_encoded = await fileToBase64UrlEncoded(
              file,
              bufferToBase64Url,
              debug,
            );
          } catch (e: unknown) {
            console.error(
              "Failed to encode data from uploaded file for uploading: ",
              e,
            );
            toast({
              variant: "destructive",
              title: "Failed to encode data from uploaded file for uploading!",
              description:
                e instanceof Error
                  ? e.message
                  : "An unknown error has occurred!",
            });
            return;
          }

          if (debug) {
            console.log(
              "[FileInput] Successfully encoded file data as base64url: ",
              base64url_encoded,
            );
          }

          setValue(base64url_encoded);

          return;
        }}
        className={cn(
          disabled ? "hover:cursor-not-allowed" : "hover:cursor-pointer",
        )}
      />
    </div>
  );
}

export default FileInput;
