# @schemavaults/ui

## About

SchemaVaults React.js UI component library package. [Here's the @schemavaults/ui Storybook.js site](https://ui.schemavaults.com) which previews some of the utilities and UI components avaialble.

## Usage

### Ensure that globals.css is imported from @schemavaults/theme

```javascript
import "@schemavaults/theme/globals.css"
```

### Ensure that the app's TailwindCSS configuration `content` field matches any code files

```javascript
// ...
const config = configFactory.createConfig({
  content: ["./src/**/*.ts|tsx|js|jsx", "../../packages/ui/dist/**/*.ts|tsx|js|jsx"]
});
export default config;
```


### Import and render components

```tsx
"use client";
import { Button } from "@schemavaults/ui";
import type { ReactElement } from "react";

function MyButton(): ReactElement {
  return (
    <Button>Submit</Button>
  )
}
```

## Storybook.js

This project contains a [Storybook.js](https://storybook.js.org/) setup.

### SchemaVaults UI Storybook.js Site Development

Run the Storybook development server:
```bash
bun run storybook
```

### SchemaVaults UI Storybook.js Production Site

Find a live version of the SchemaVaults UI Storybook site at: [ui.schemavaults.com](https://ui.schemavaults.com)

Build a production version of the site with:
```bash
bun run build:storybook
```
