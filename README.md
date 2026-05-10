# @zuzjs/ui

The `@zuzjs/ui` library provides a collection of reusable components and blocks designed to streamline your development process. It also includes an automatic CSS generator to help you maintain consistent styling across your application.

## Features

- **Components**: A variety of pre-built UI components to speed up your development.
- **Blocks**: Modular blocks that can be easily integrated into your projects.
- **Auto CSS Generator**: Automatically generates CSS to ensure consistent and maintainable styles.

## Installation

To install the `@zuzjs/ui` library, use the following command:

```bash
npm install @zuzjs/ui
```

## Usage

Import the components and blocks you need and start building your UI:

```javascript
import { Box, Button, Text } from '@zuzjs/ui';

function App() {
    return (
        <Box as={`w:100 h:100 bg:red`}>
            <Button as={`s:18 bold tac`}>Click Me</Button>
            <Text as={`s:18 tac`}>Hello World!</Text>
        </Box>
    );
}
```

The auto CSS generator will handle the styling for you, ensuring a cohesive look and feel.

## Animation Examples

### 1) CSS Scroll Scenes (No TimelineProvider Required)

Use `useScrollScenes` for scroll-driven animations that are generated as CSS keyframes.

```tsx
import { Flex, Text, useScrollScenes } from "@zuzjs/ui";

export default function Landing() {
    const scenes = useScrollScenes({
        id: "landing",
        tracks: {
            heroHeadline: {
                keyframes: [
                    { at: 0, y: "0" },
                    { at: 0.33, y: "-1lh" }
                ],
                easing: "var(--spring)"
            }
        },
        scenes: {
            hero3: { start: 0.62, inEnd: 0.69, outStart: 0.83, end: 0.90 },
            hero4: { start: 0.83, inEnd: 0.90, outStart: 1, end: 1, outY: "0", outOpacity: 1 }
        }
    });

    return (
        <Flex cols className={scenes.scopeClass} style={{ height: "600vh" }}>
            <Flex as="sticky top:0 h:100vh" className={scenes.className("hero3")}>
                <Text className={scenes.className("heroHeadline")}>Animated with CSS scene track</Text>
            </Flex>
            <Flex as="sticky top:0 h:100vh" className={scenes.className("hero4")}>
                <Text>Second scene</Text>
            </Flex>
        </Flex>
    );
}
```

Notes:
- `TimelineProvider` is not required when a page uses only `useScrollScenes` classes.
- For build-time CSS extraction into `src/app/css/zuz.scss`, pass a literal object config to `useScrollScenes(...)`.

### 2) TimelineProvider + `timeline` Prop (Existing Engine)

Use this mode when you want layer-based timeline bindings and anchor syntax.

```tsx
import { Box, TimelineProvider } from "@zuzjs/ui";

export default function Hero() {
    return (
        <TimelineProvider timeline={{ mode: "timeline", interpolate: true, lerpFactor: 0.08 }}>
            <Box timelineRoot as="h:300vh">
                <Box
                    timeline={{
                        id: "hero",
                        keyframes: [{ start: 0, end: 0.33, y: [0, "-1lh", "$spring"] }]
                    }}
                >
                    Timeline layer animation
                </Box>
            </Box>
        </TimelineProvider>
    );
}
```

---

## Visual Builder Engine

`@zuzjs/ui` ships a Visual Builder Engine — a recursive JSON-tree-driven design system that lets you compose pages in a WYSIWYG canvas and export production-ready Next.js code on the fly.

### Architecture overview

```
ZuzTree (JSON)
  └─ ZuzNode (root grid)
       ├─ ZuzNode (grid — 2-col split)
       │    ├─ ZuzNode (component: Text)
       │    └─ ZuzNode (component: Button)
       └─ ZuzNode (grid — 3-col split)
            ├─ ZuzNode (component: Avatar)
            ├─ ZuzNode (component: Badge)
            └─ ZuzNode (empty cell — click to split)
```

Every node is either:
- **`"grid"`** — a `<Flex>` layout container with CSS-grid shorthands.
- **`"component"`** — a leaf `@zuzjs/ui` component (`Box`, `Text`, `Button`, `Icon`, …).

All visual styles are stored as atomic shorthand tokens in the `as` prop (`p:20`, `aic`, `gap:10`, `bg:[$surface]`). No raw inline styles, no className strings.

### Imports

```ts
// Types only (safe for server / Node)
import type { ZuzNode, ZuzTree, ZuzGridNode, SplitDirection } from "@zuzjs/ui/src/builder/visual";

// Compiler (pure function, no React)
import { generatePageSource, generateFragment } from "@zuzjs/ui/src/builder/visual";

// React components (client-only)
import { ZuzBuilder, VisualCanvas, createBlankTree } from "@zuzjs/ui/src/builder/visual";
```

---

### 1. Define a tree manually

```ts
import type { ZuzTree, ZuzGridNode } from "@zuzjs/ui/src/builder/visual";

const tree: ZuzTree = {
  id: "page-home",
  name: "Home Page",
  root: {
    id: "root",
    type: "grid",
    columns: 1,
    as: ["grid", "gap:24", "p:32", "w:full"],
    children: [
      // Hero — 2-column layout
      {
        id: "hero",
        type: "grid",
        columns: 2,
        as: ["grid", "gtc:[repeat(2,1fr)]", "gap:16", "aic"],
        children: [
          {
            id: "hero-copy",
            type: "grid",
            columns: 1,
            as: ["grid", "gap:12"],
            children: [
              {
                id: "hero-title",
                type: "component",
                component: "Text",
                as: ["fs:40", "bold", "c:[$text]", "lh:1.15"],
                props: { children: "Build faster with Zuz" },
              },
              {
                id: "hero-sub",
                type: "component",
                component: "Text",
                as: ["fs:16", "c:[$text-muted]"],
                props: { children: "A visual layer on top of @zuzjs/ui" },
              },
              {
                id: "hero-cta",
                type: "component",
                component: "Button",
                as: ["p:12,28", "r:8", "bg:[$brand]", "c:white", "fs:15"],
                props: { children: "Get started" },
              },
            ],
          },
          {
            id: "hero-image",
            type: "component",
            component: "Image",
            as: ["w:full", "r:12", "h:360", "object-fit:cover"],
            props: { src: "/hero.png", alt: "Hero visual" },
          },
        ],
      },
      // Feature strip — 3-column layout
      {
        id: "features",
        type: "grid",
        columns: 3,
        as: ["grid", "gtc:[repeat(3,1fr)]", "gap:16", "p:24,0"],
        children: ["Fast", "Atomic", "HMR-ready"].map((title, i) => ({
          id: `feature-${i}`,
          type: "grid",
          columns: 1,
          as: ["grid", "gap:8", "p:20", "r:12", "bg:[$surface-2]", "border:1,[$border-color],solid"],
          children: [
            {
              id: `f-icon-${i}`,
              type: "component",
              component: "Icon",
              as: ["fs:24", "c:[$brand]"],
              props: { name: ["zap", "hash", "refresh-cw"][i] },
            },
            {
              id: `f-title-${i}`,
              type: "component",
              component: "Text",
              as: ["fs:16", "bold", "c:[$text]"],
              props: { children: title },
            },
          ],
        })),
      },
    ],
  } as ZuzGridNode,
};
```

---

### 2. Compile the tree to Next.js source

```ts
import { generatePageSource } from "@zuzjs/ui/src/builder/visual";

const source = generatePageSource(tree, {
  componentName: "HomePage",
  indent: "  ",
});

console.log(source);
```

**Output** (auto-detected imports, no div soup, pure `as` shorthands):

```tsx
"use client";

import { Button, Flex, Icon, Image, Text } from "@zuzjs/ui";

/**
 * HomePage
 * Auto-generated by ZuzBuilder – do not edit manually.
 * Source tree id: page-home
 */
export default function HomePage() {
  return (
    <Flex as="grid gap:24 p:32 w:full">
      <Flex as="grid gtc:[repeat(2,1fr)] gap:16 aic">
        <Flex as="grid gap:12">
          <Text as="fs:40 bold c:[$text] lh:1.15">Build faster with Zuz</Text>
          <Text as="fs:16 c:[$text-muted]">A visual layer on top of @zuzjs/ui</Text>
          <Button as="p:12,28 r:8 bg:[$brand] c:white fs:15">Get started</Button>
        </Flex>
        <Image as="w:full r:12 h:360 object-fit:cover" src="/hero.png" alt="Hero visual" />
      </Flex>
      <Flex as="grid gtc:[repeat(3,1fr)] gap:16 p:24,0">
        <Flex as="grid gap:8 p:20 r:12 bg:[$surface-2] border:1,[$border-color],solid">
          <Icon as="fs:24 c:[$brand]" name="zap" />
          <Text as="fs:16 bold c:[$text]">Fast</Text>
        </Flex>
        {/* … */}
      </Flex>
    </Flex>
  );
}
```

---

### 3. Render the interactive canvas

Drop `<VisualCanvas>` anywhere in your app to render the tree as a clickable WYSIWYG canvas:

```tsx
"use client";
import { useState } from "react";
import { VisualCanvas } from "@zuzjs/ui/src/builder/visual";
import type { SplitDirection, ZuzTree } from "@zuzjs/ui/src/builder/visual";

export default function CanvasPreviewPage({ tree }: { tree: ZuzTree }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSplit(nodeId: string, direction: SplitDirection) {
    // dispatch SPLIT action to your tree state manager
    console.log("split", nodeId, direction);
  }

  return (
    <VisualCanvas
      tree={tree}
      onSplitRequest={handleSplit}
      onSelect={setSelectedId}
      selectedId={selectedId}
    />
  );
}
```

**Canvas behaviour:**
- **Empty cells** show a `+` trigger on hover.
- **Clicking `+`** opens an inline split picker (`2 cols`, `3 cols`, `4 cols`, `2 rows`, `3 rows`).
- **Selecting a cell** highlights it with a brand-colour outline (`--zb-selected`).
- Clicking the canvas background deselects.

---

### 4. Full builder with inspector + undo/redo

`<ZuzBuilder>` wraps `<VisualCanvas>` with a toolbar and inspector panel:

```tsx
"use client";
import { ZuzBuilder, createBlankTree } from "@zuzjs/ui/src/builder/visual";
import type { ZuzTree } from "@zuzjs/ui/src/builder/visual";

export default function BuilderPage() {
  // Start from scratch
  const initialTree = createBlankTree("My Landing Page");

  async function handleSave(source: string) {
    const res = await fetch("/api/zuz/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, filename: "my-landing-page" }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    console.log("Saved to", data.path);
  }

  return (
    <ZuzBuilder
      initialTree={initialTree}
      onChange={(tree: ZuzTree, source: string) => {
        // live preview — source is the compiled TSX string
      }}
      onSave={handleSave}
    />
  );
}
```

**Builder features:**

| Feature | Detail |
|---|---|
| Undo / redo | Full history stack via `useReducer` — unlimited steps |
| Cell split | Click empty cell → pick split direction → tree updates instantly |
| Inspector | Edit the `as` token string for any selected node; patches on blur |
| Node delete | One-click delete from inspector sidebar |
| Node move | Dispatch `MOVE_NODE` to reparent any node |
| Save | Compiles tree → calls `onSave(source)` → your handler persists the file |

---

### 5. Persist to the filesystem — `POST /api/zuz/save`

The route handler at `app/api/zuz/save/route.ts` writes the compiled source to `app/(generated)/<filename>/page.tsx`. Next.js Fast Refresh picks it up immediately.

```ts
// Request
const res = await fetch("/api/zuz/save", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    source:   compiledTsxString,  // must contain "use client"
    filename: "my-landing-page",  // [a-zA-Z0-9_-]{1,64} only
  }),
});

// Success response
// { "ok": true, "path": "src/app/(generated)/my-landing-page/page.tsx" }

// Error response
// { "ok": false, "error": "…reason…" }
```

**Security constraints enforced by the route:**

| Constraint | Implementation |
|---|---|
| Filename allowlist | `SAFE_FILENAME_RE = /^[a-zA-Z0-9_-]{1,64}$/` |
| Path traversal guard | `path.resolve` + `startsWith(GENERATED_DIR + sep)` check |
| Source validation | Must be non-empty string containing `"use client"` directive |
| Restricted HTTP methods | Only `POST` is handled; all others return `405` |

---

### 6. End-to-end flow

```
User clicks "+" on empty cell
        │
        ▼
SplitPicker → user picks "2-col"
        │
        ▼
dispatch({ type: "SPLIT", targetId, direction: "2-col" })
        │
        ▼
applySplit() clones tree, inserts ZuzGridNode { columns: 2, children: [2 empty cells] }
        │
        ▼
VisualCanvas re-renders — new grid appears immediately
        │
        ▼
User edits "as" tokens in Inspector → UPDATE_NODE patch applied
        │
        ▼
User presses "Save"
        │
        ▼
generatePageSource(tree) → valid TSX string
        │
        ▼
POST /api/zuz/save { source, filename }
        │
        ▼
fs.writeFileSync("app/(generated)/my-page/page.tsx", source)
        │
        ▼
Next.js HMR detects file change → Fast Refresh fires
```

---

### 7. File reference

| File | Role |
|---|---|
| `src/builder/zuz-node.ts` | `ZuzNode`, `ZuzTree`, `ZuzGridNode`, all action types |
| `src/builder/compiler.ts` | `generatePageSource()`, `generateFragment()` |
| `src/builder/visual-canvas.tsx` | `<VisualCanvas>` — recursive interactive renderer |
| `src/builder/zuz-builder.tsx` | `<ZuzBuilder>` — full builder with state, undo/redo, inspector |
| `src/builder/visual.ts` | Public barrel — re-exports all of the above |
| `app/api/zuz/save/route.ts` | Next.js route handler — compiles + writes `.tsx` to disk |

---

## Documentation

Documention in progress.

## AI Skill Guide

For AI-assisted UI generation with this library (Copilot/Claude), use:

| File | Purpose |
|---|---|
| `AI_SKILL.md` | Full `as` prop grammar, responsive/pseudo syntax, authoring rules |
| `AGENTS.md` | Copilot agent entry — points to AI_SKILL.md |
| `CLAUDE.md` | Claude entry — aliases AGENTS.md |
| `component-schema.json` | Machine-readable component + prop index for programmatic agent consumption |
| `PROMPT_PRESETS.md` | Copy-paste prompt templates for common patterns (tables, forms, drawers) |

These files define component prop resolution rules, `as` syntax, shorthand utility classes, and generation constraints.

## License

This project is licensed under the MIT License.