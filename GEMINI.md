# Zuz Framework Project Context

## Project Overview
Zuz is a custom Atomic CSS engine built for Next.js. It uses a **Builder-Watcher** pattern to scan `.tsx` and `.jsx` files for an `as` prop, generates atomic utility classes, and saves them to a global `.scss` file.

## Core Architecture
- **Engine:** `packages/ui/builder/` (Lexer, Style Generator, and Builder).
- **Watcher:** `bin.ts` (using Commander and Chokidar).
- **Styles Source:** `packages/ui/builder/stylesheet.ts`.
- **Manifest:** Generated at `src/app/css/zuzmap.ts` to map `as` strings to hashed classes.
- **Injection:** The `zuzmap` is injected into the UI library via `setZuzMap()` in the root `layout.tsx`.

## Styling Rules (The `as` Prop)
The `as` prop is the primary styling interface. It supports two types of values:

1. **Property Shortcuts (`zp`):** Format is `key:value`. 
   - Examples: `bg:red`, `w:100px`, `m:20`, `flex:1`.
   - Keys are mapped in `cssProps` in `stylesheet.ts`.

2. **Direct Shortcuts (`zs`):** Format is a single keyword.
   - Examples: `jcc` (justify-content: center), `abs` (absolute), `f` (flex).
   - Keys are mapped in `cssDirect` in `stylesheet.ts`.

## Development Workflow
- **Init:** `npx zuz init` generates VS Code snippets and configures `.vscode/settings.json`.
- **Snippets:**
  - `zp` -> Triggers Property dropdown with `:` suffix.
  - `zs` -> Triggers Direct Shortcut dropdown.
- **Watcher:** Runs automatically to update `zuz.scss` and `zuzmap.ts` on file changes.

## Type Definitions
We use a specialized type `ZuzStyleString` to ensure Intellisense works for both mapped keys and custom strings:
```typescript
type ZuzStyleString = ZuzCommonValues | (string & {});