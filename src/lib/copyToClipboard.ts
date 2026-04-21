/**
 * Write `value` to the user's clipboard. Returns true if the write succeeded.
 *
 * Prefers the async `navigator.clipboard.writeText` API when available in a
 * secure context, and falls back to a transient `<textarea>` + `execCommand`
 * path for older browsers or insecure contexts (e.g. http://). Returns false
 * if both paths fail or if called outside of a browser environment.
 */
export async function copyToClipboard(value: string): Promise<boolean> {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function" &&
    typeof window !== "undefined" &&
    window.isSecureContext !== false
  ) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the textarea-based fallback below.
    }
  }

  if (typeof document === "undefined") return false;

  try {
    const textarea: HTMLTextAreaElement = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, value.length);
    const succeeded: boolean = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}
