---
name: no-forward-ref
description: Do NOT use `React.forwardRef` in this codebase. It is deprecated as of React 19 — refs are passed as ordinary props on function components. Load this skill any time you are about to write, refactor, or copy-paste a component that uses `forwardRef` (including patterns like `forwardRef<HTMLDivElement, Props>((props, ref) => …)`, importing `forwardRef` from `react`, or using `Ref<T>` / `ForwardedRef<T>` as the second parameter of a component). Also load when a linter or type error mentions `forwardRef`, when reviewing a diff that adds one, or when the user references "ref forwarding" / "passing a ref through" a component. This project depends on React 19 (see `package.json` peerDependencies).
---

# No `forwardRef` — use ref-in-props (React 19)

This project is on React 19. `React.forwardRef` is **deprecated** and should not appear in new or refactored code. In React 19, `ref` is a normal prop on function components: destructure it from props and forward it to the underlying element like any other value.

Do NOT use `forwardRef` here even if:
- You're porting a shadcn/ui or Radix example that uses it — rewrite it before landing.
- Older files in this repo still use it — those are legacy; new code follows the new pattern.
- You want a "typed ref helper" — the type is just `Ref<T>` on the props, no wrapper needed.

## The correct pattern

```tsx
import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface MyBoxProps extends ComponentProps<"div"> {
  emphasis?: boolean;
}

function MyBox({
  ref,
  className,
  emphasis,
  ...props
}: MyBoxProps): ReactElement {
  return (
    <div
      ref={ref}
      className={cn("rounded-md p-2", emphasis && "ring-2", className)}
      {...props}
    />
  );
}

MyBox.displayName = "MyBox";
export { MyBox };
```

Key points:
- `ComponentProps<"div">` in `@types/react@19` already includes `ref?: Ref<HTMLDivElement>` — no `Omit<..., "ref">` and no separate typing needed.
- Destructure `ref` from props and pass it straight through to the DOM element (or another component that accepts a ref).
- No `forwardRef` import, no `(props, ref) => …` two-argument signature, no generic type argument `forwardRef<T, P>`.
- `displayName` still works and should still be set for components exported by name.

## The pattern to REMOVE

```tsx
// ❌ Do not do this in new code.
import { forwardRef, type Ref } from "react";

function MyBoxImpl(
  { className, emphasis, ...props }: MyBoxProps,
  ref: Ref<HTMLDivElement>,
) {
  return <div ref={ref} className={cn("…", className)} {...props} />;
}

export const MyBox = forwardRef<HTMLDivElement, MyBoxProps>(MyBoxImpl);
MyBox.displayName = "MyBox";
```

When you see the above shape, rewrite it into the correct pattern before adding new behavior.

## Migration checklist

When converting an existing `forwardRef` component:

1. Remove the `forwardRef` (and `Ref` / `ForwardedRef`) imports from `react`.
2. Merge the two-argument `(props, ref)` signature into a single destructured props parameter that includes `ref`.
3. If the props interface used `Omit<ComponentPropsWithoutRef<"div">, "ref">` or `ComponentPropsWithoutRef<T>`, replace it with `ComponentProps<T>` — that already includes the correct `ref` type in React 19.
4. Delete the `forwardRef<T, P>(Impl)` wrapper and export the plain function component directly.
5. Keep the `displayName` assignment if the component was named for React DevTools.
6. Re-run `bun run typecheck` and `bun run typecheck:storybook`.

## Radix / Slot components

Radix's `<Slot>` still accepts `ref` on the wrapping function component the same way. Use the same ref-in-props pattern; nothing special is required.

```tsx
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ComponentProps<"button"> {
  asChild?: boolean;
}

function Button({ ref, asChild, className, ...props }: ButtonProps): ReactElement {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn("…", className)} {...props} />;
}
```

## Why

- `forwardRef` in React 19 is deprecated and will be removed in a future major version — see the React 19 release notes.
- The ref-in-props pattern removes a wrapper function, simplifies typing (no dual generic parameters), and makes components look like plain functions again.
- Keeping the codebase on one modern pattern avoids drift between "old-style" and "new-style" components.

## Quick grep to find remaining offenders

```bash
grep -rn "forwardRef" src/
```

Every hit is a candidate for migration when you're already touching that file. Don't do a codebase-wide mechanical sweep unless the user asks for one — migrate opportunistically as files come up in normal work.
