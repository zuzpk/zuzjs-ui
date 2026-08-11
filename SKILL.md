---
name: "zuzjs-ui"
description: "Generate production React UI with @zuzjs/ui using real components, props, and the as styling DSL"
triggers:
  - type: Keyword
    words:
      - "@zuzjs/ui"
      - "zuz ui"
      - "zuzjs ui"
      - "ProgressBar"
      - "Flex"
      - "Box"
      - "as styling"
      - "as prop"
keywords:
  - "@zuzjs/ui"
  - "zuz ui"
  - "zuzjs ui"
  - "ProgressBar"
  - "Flex"
  - "Box"
  - "as styling"
file_patterns: []
---

# Zuz UI Generation Skill (Copilot + Claude)

Use this skill whenever generating UI with `@zuzjs/ui`.

## Goal

Generate production-ready UI that is accurate to this library's real API:
- Component names and imports
- Prop names and prop types
- `as` utility syntax
- CSS shorthand/direct classes
- Responsive and pseudo/nesting utility groups

Never invent props or class shortcuts.

## Companion Files

| File | Purpose |
|---|---|
| `./component-schema.json` | Machine-readable prop index beside this `SKILL.md` — read it with `read_file` to check exact component exports, prop names, and types before generating |

`./component-schema.json` is a companion file, not automatically injected with this skill. Read it from this skill directory whenever an unfamiliar component, prop, handler, or `as` token needs verification.

## Source Of Truth

Always resolve from these files in this order:

1. `./component-schema.json` ← **start here** — adjacent to this `SKILL.md`; use `read_file` on this exact path for the fastest structured lookup
2. The package's `src/comps/index.ts` — authoritative export surface
3. `src/comps/<Component>/types.ts` — authoritative props
4. `src/types/interfaces.ts` — common `ZuzProps`
5. `src/types/shared.ts` — `Props<T>` generic
6. `src/builder/stylesheet.ts` — utility shorthand maps (`cssProps`, `cssDirect`)
7. `src/builder/style-generator.ts` — parser rules, units, pseudo/media handling, nested selector behavior

## Mandatory Prop Model

Most components are built from `Props<T>` or `BoxProps`.

Common props from `ZuzProps`:
- `as?: ZuzStyleString | ZuzStyleString[]`
- `className?: string`
- `skeleton?: Skeleton`
- `fx?: animationProps`
- `transition?: TRANSITIONS`
- `draggable?: boolean`
- `dragOptions?: DragOptions`
- `busy?: boolean`
- `stripes?: 'background' | 'overlay'`

`Props<T>` also includes native DOM props for that tag.

## Component Prop Lookup

Use `./component-schema.json` as the canonical prop index. Each entry contains:

- `export` — how the component is exported from `@zuzjs/ui`.
- `typesFile` — the source `types.ts` or component file where props are defined.
- `props` — prop names mapped to their TypeScript type strings.
- `handler` — imperative handler type exposed via `ref` (if any).
- `context` — related context type (if any).

Key component-specific prop groups:

- **Layout primitives**: `Box`, `Flex`, `Grid`, `Group`, `Stack` — extend `BoxProps`.
- **Form inputs**: `Input`, `Textarea`, `Select`, `CheckBox`, `Radio`, `Switch`, `Password`, `PinInput`, `PhoneInput`, `Search`, `AutoComplete`, `DatePicker`, `ColorPicker` — extend `Props<'input'>` / `InputProps`.
- **Overlays**: `Dialog`, `Drawer`, `Sheet`, `Overlay`, `Lightbox`, `Cover` — extend `BoxProps` or `ZuzProps`.
- **Data display**: `Table`, `List`, `TreeView`, `Chart`, `Calendar`, `ChatList`, `ChatBubble` — extend `BoxProps`.
- **Agent UI**: `AgentChat` is a transport-neutral chat shell. It receives an `AgentController` from `useAgent({ client })` in `@zuzjs/hooks`, `AgentCapabilities`, an optional Zuz `variant`, `renderSidebar`, and an optional `renderMarkdown` override. `AgentChatProvider` with `useAgentChat()` exposes the same raw controller/configuration to host-owned UI.
- **Feedback**: `Alert`, `ToastProvider`, `Badge`, `ProgressBar`, `Spinner`, `NetworkStatus` — extend `BoxProps`.
- **Navigation**: `TabView`, `Crumb`, `Pagination`, `ActionBar` — extend `BoxProps`.
- **Media**: `Image`, `MediaPlayer`, `Cropper` — extend `BoxProps` or `Props<'img'>`.
- **Text**: `Text`, `Span`, `Label` — extend `Props<'span'>` / `Props<'label'>`.

Components with imperative handlers (use `ref`):
- `Dialog` → `DialogController`
- `Drawer` → `DrawerController`
- `Sheet` → `SheetHandler`
- `Select` → `SelectHandler`
- `Slider` → `SliderController`
- `Table` → `TableController`
- `Terminal` → `TerminalHandler`
- `ToolTip` → `ToolTipController`
- `List` → `ListHandler`
- `CheckBox` / `Switch` → `CheckboxHandler`

## AgentChat

Use `AgentChat` when the host supplies an `AgentClient` transport and wants the standard reusable chat presentation. Keep the transport in the host/application; `@zuzjs/ui` owns only rendering.

```tsx
import { useMemo } from 'react';
import { useAgent, type AgentClient } from '@zuzjs/hooks';
import { AgentChat, Variant } from '@zuzjs/ui';

function ChatScreen({ client }: { client: AgentClient }) {
  const stableClient = useMemo(() => client, [client]);
  const agent = useAgent({ client: stableClient });

  return <AgentChat
    agent={agent}
    variant={Variant.Medium}
    brand={{ name: 'Echo' }}
    capabilities={{
      sessions: true,
      archive: true,
      cancel: true,
      activity: true,
      contextMode: true,
    }}
  />;
}
```

- `variant` defaults to `Variant.Medium`; it applies `--xs` through `--xl` and resolves padding/radius through the library size variables.
- `AgentMarkdown` is the built-in Markdown renderer with GFM and `CodeBlock`. Use `renderMarkdown(content, message)` only for host-specific behavior such as math, Mermaid, or custom link handling.
- `AgentChat` fills its parent instead of the viewport. Give the host shell, panel, or webview container an explicit size; the messages and SendBox use the same available width.
- Set `renderSidebar={false}` to omit the built-in session sidebar. `AgentChat` still renders the primary chat and exposes the controller through its provider.
- To build a custom session list, wrap it and the chat in `AgentChatProvider`, then call `useAgentChat()` inside the custom UI to access `agent`, `capabilities`, `composerControls`, `brand`, and `renderMarkdown`.

```tsx
<AgentChatProvider agent={agent} capabilities={capabilities} brand={{ name: 'Echo' }}>
  <CustomSidebar />
  <AgentChat agent={agent} capabilities={capabilities} renderSidebar={false} />
</AgentChatProvider>
```

- `AgentChat.scss` defines `--agent-chat-*` semantic variables in `body`. Override them globally or on an ancestor; bubble tokens are scoped inside `.--agent-chat`.
- Import `@zuzjs/ui/styles` once at the application root so `AgentChat.scss` is included.

## `as` Utility Grammar

`as` accepts string or string array.

Token types:

1. Direct shortcut token
- Example: `flex`, `aic`, `jcc`, `rel`, `abs`, `bold`
- Source: `cssDirect`

2. Property token
- Format: `key:value`
- Example: `w:320`, `p:12`, `bg:red`, `r:12`, `opacity:0.7`
- Source: `cssProps`

3. Custom class token
- Example: `--card`, `--hero-title`
- Passed through as class name when unknown to map

### Value Rules

- Numeric values become `px` by default.
  - `w:100` -> `width:100px`
- Unitless-safe keys stay unitless (`opacity`, `zIndex`, `flex`, `fontWeight`, `lineHeight`, `scale`, `ratio`, etc.).
- `full` -> `100%`, `half` -> `50%`
- Comma-separated values are expanded per key logic.
  - Example: `p:8,12` -> `padding: 8px 12px`
- Bracket values support expressions/functions and `$token` CSS variable replacement.
  - Example: `w:[calc(100%-24)]`
  - Example: `bg:[$surface]` -> `background: var(--surface)`

## Pseudo, Responsive, Nested Syntax

Group syntax:
- `&pseudo(...)`
- `@breakpoint(...)`
- `selector(...)`

Examples:
- `&hover(bg:black c:white)`
- `&focus(border:1,$brand,solid)`
- `@md(w:420 p:20)`
- `@lg(flex cols)`
- `button(c:$text)`

Supported pseudo aliases include:
- `&even`, `&odd`, `&first`, `&last`, `&nth(...)`

Responsive aliases from style generator:
- `@ph` phone max-width 599
- `@sm` 600-767
- `@md` 768+
- `@lg` 992+
- `@xl` 1200+

## Frequently Used Direct Shortcuts

Layout:
- `flex`, `grid`, `wrap`, `cols`, `cols-reverse`
- `fill`, `rel`, `abs`, `fixed`, `sticky`

Alignment:
- `aic`, `ais`, `aie`, `ass`
- `jcc`, `jcs`, `jce`, `jcb`, `jca`
- `pic`, `pis`, `pie`, `pcc`, `pcs`, `pce`

Text:
- `tal`, `tac`, `tar`, `tas`
- `uppercase`, `lowercase`, `capitalize`
- `text-wrap`, `text-clip`, `word-break`
- `tdn`, `tdu`, `bold`

Interaction/visibility:
- `nous`, `nope`, `pe-none`, `pe-auto`
- `hide`, `block`, `inlineblock`

Overflow:
- `no-overflow`, `no-overflow-x`, `no-overflow-y`
- `overflow-x`, `overflow-y`, `scroll-x`, `scroll-y`

Ratio:
- `ratio-square`, `ratio-video`, `ratio-monitor`, `ratio-photo`, `ratio-portrait`, `ratio-tall`

## Frequently Used Property Shortcuts

Spacing and size:
- `w`, `minW`, `maxW`, `h`, `minH`, `maxH`
- `m`, `mt`, `mr`, `mb`, `ml`, `mv`, `mh`
- `p`, `pt`, `pr`, `pb`, `pl`, `pv`, `ph`

Color and visuals:
- `bg`, `bgc`, `c`, `shadow`, `opacity`, `filter`

Typography:
- `s` (`font-size`), `b` (`font-weight`), `lh`, `align`

Transforms and animation:
- `x`, `y`, `z`, `translateX`, `translateY`, `rotate`, `scale`, `view`, `anim`

Radius:
- `r`, `rtl`, `rtr`, `rbl`, `rbr`

## Component Authoring Rules

When generating UI code:

1. Imports
- Use `import { ... } from '@zuzjs/ui'`.
- Import only exported names from `src/comps/index.ts`.

2. Props
- Validate each component prop against `src/comps/<Component>/types.ts`.
- If uncertain, prefer base-safe props: `as`, `className`, native DOM props.

3. Styling
- Put utility tokens in `as`.
- Put BEM/semantic classes in `className` or prefixed custom tokens like `--card` inside `as`.
- Use responsive/pseudo groups for behavior instead of ad-hoc CSS when possible.

4. Accessibility
- Preserve semantic tags (`Text` heading level via `h`, proper labels/aria props, keyboard handlers for interactive elements).

5. No hallucinations
- Do not invent variants, token names, or event props.

## Output Checklist For Agents

Before finalizing generated UI, verify:
- All components are exported by `@zuzjs/ui`.
- Every non-native prop exists in the corresponding component `types.ts`.
- Every shorthand token exists in `cssProps`/`cssDirect` OR is an intentional custom class (`--...`).
- `as` strings are space-delimited tokens and grouped syntax is balanced.
- Responsive and pseudo groups use `@` / `&` syntax correctly.

## Quick Example

```tsx
import { Box, Flex, Text, Input, Button } from '@zuzjs/ui';

export default function ProfileCard() {
  return (
    <Box as="--profile-card w:[min(100%,420)] p:16 r:16 bg:$surface shadow:0,8,24,rgba[0,0,0,0.12] @md(p:20)">
      <Flex aic jcb as="mb:12">
        <Text h={3} as="s:lg bold">Profile</Text>
        <Text as="s:sm c:$muted">Online</Text>
      </Flex>

      <Input
        name="displayName"
        placeholder="Display name"
        as="w:100% mb:10 &focus(border:1,$brand,solid)"
      />

      <Flex jce as="mt:8 gap:8">
        <Button kind="ghost" as="ph:12 pv:8">Cancel</Button>
        <Button kind="solid" as="ph:12 pv:8">Save</Button>
      </Flex>
    </Box>
  );
}
```

## Optional Prompt Template

Use this when asking an agent for UI code:

"Generate a [screen/component] using `@zuzjs/ui`. Follow `packages/ui/AI_SKILL.md`. Only use exported components and real props from their `types.ts`. Use `as` utility syntax from `cssProps`/`cssDirect`, including responsive/pseudo groups where useful."