"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import {
  type CopyButtonSize,
  type CopyButtonVariant,
  copyButtonSizeIds,
  copyButtonVariantIds,
} from "./copy-button-variants";

const copyButtonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[copied=true]:bg-primary/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[copied=true]:border-schemavaults-brand-blue data-[copied=true]:text-schemavaults-brand-blue",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[copied=true]:text-schemavaults-brand-blue",
        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground data-[copied=true]:text-schemavaults-brand-blue",
        brand:
          "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90",
      } satisfies Record<CopyButtonVariant, string>,
      size: {
        sm: "h-8 rounded-md px-2.5 text-xs [&_svg]:size-3.5",
        md: "h-9 px-3 text-sm [&_svg]:size-4",
        lg: "h-10 rounded-md px-4 text-sm [&_svg]:size-4",
        "icon-sm": "h-7 w-7 rounded-md [&_svg]:size-3.5",
        "icon-md": "h-9 w-9 [&_svg]:size-4",
        "icon-lg": "h-10 w-10 rounded-md [&_svg]:size-[18px]",
      } satisfies Record<CopyButtonSize, string>,
    },
    defaultVariants: {
      variant: "ghost",
      size: "icon-md",
    },
  },
);

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onCopy">,
    VariantProps<typeof copyButtonVariants> {
  /**
   * The text value to copy to the clipboard.
   */
  value: string;
  /**
   * Duration, in milliseconds, that the "copied" state is shown after a
   * successful copy before reverting to the idle state. Defaults to 2000.
   */
  resetDelay?: number;
  /**
   * Optional label rendered next to the icon in the idle state. When provided,
   * the button automatically switches to a labelled layout. Use an "icon-*"
   * size to render an icon-only button.
   */
  label?: ReactNode;
  /**
   * Optional label rendered next to the icon in the "copied" state. Defaults
   * to "Copied!" when `label` is provided.
   */
  copiedLabel?: ReactNode;
  /**
   * Accessible label announced to screen readers in the idle state. Defaults
   * to "Copy to clipboard".
   */
  ariaLabel?: string;
  /**
   * Accessible label announced to screen readers in the copied state. Defaults
   * to "Copied to clipboard".
   */
  copiedAriaLabel?: string;
  /**
   * Callback fired after a copy attempt. Receives the success flag and the
   * original value that was attempted to be copied.
   */
  onCopy?: (success: boolean, value: string) => void;
  /**
   * Optional override for the idle icon. Defaults to `<Copy />` from lucide.
   */
  icon?: ReactNode;
  /**
   * Optional override for the success icon. Defaults to `<Check />` from
   * lucide.
   */
  copiedIcon?: ReactNode;
}

async function writeToClipboard(value: string): Promise<boolean> {
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

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  function CopyButton(
    {
      value,
      variant,
      size,
      resetDelay = 2000,
      label,
      copiedLabel,
      ariaLabel = "Copy to clipboard",
      copiedAriaLabel = "Copied to clipboard",
      onCopy,
      icon,
      copiedIcon,
      className,
      onClick,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ): ReactElement {
    const [copied, setCopied] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect((): (() => void) => {
      return (): void => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, []);

    const handleClick = useCallback(
      async (event: ReactMouseEvent<HTMLButtonElement>): Promise<void> => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        const success: boolean = await writeToClipboard(value);
        onCopy?.(success, value);

        if (!success) return;

        setCopied(true);
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout((): void => {
          setCopied(false);
          timeoutRef.current = null;
        }, resetDelay);
      },
      [onClick, onCopy, resetDelay, value],
    );

    const resolvedIdleIcon: ReactNode = icon ?? <Copy aria-hidden="true" />;
    const resolvedCopiedIcon: ReactNode = copiedIcon ?? (
      <Check aria-hidden="true" />
    );

    const hasLabel: boolean = label !== undefined && label !== null;
    const effectiveCopiedLabel: ReactNode =
      copiedLabel !== undefined ? copiedLabel : hasLabel ? "Copied!" : null;

    const currentAriaLabel: string = copied ? copiedAriaLabel : ariaLabel;

    return (
      <button
        ref={ref}
        type={type}
        data-slot="copy-button"
        data-copied={copied ? "true" : "false"}
        aria-label={currentAriaLabel}
        aria-live="polite"
        disabled={disabled}
        onClick={handleClick}
        className={cn(copyButtonVariants({ variant, size }), className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center"
        >
          {copied ? resolvedCopiedIcon : resolvedIdleIcon}
        </span>
        {hasLabel ? (
          <span>{copied ? effectiveCopiedLabel : label}</span>
        ) : null}
      </button>
    );
  },
);
CopyButton.displayName = "CopyButton";

export {
  CopyButton,
  copyButtonVariants,
  copyButtonSizeIds,
  copyButtonVariantIds,
};
export type { CopyButtonSize, CopyButtonVariant };

export default CopyButton;
