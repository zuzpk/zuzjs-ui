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
| `component-schema.json` | Machine-readable prop index — check exact prop names/types before generating |
| `PROMPT_PRESETS.md` | Ready-to-use generation prompts for common patterns and simplebackups |

## Source Of Truth

Always resolve from these files in this order:

1. `component-schema.json` ← **start here** — fastest structured lookup
2. `src/comps/index.ts` — authoritative export surface
3. `src/comps/<Component>/types.ts` — authoritative props
4. `src/types/interfaces.ts` — common `ZuzProps`
5. `src/types/shared.ts` — `Props<T>` generic

5. `src/builder/stylesheet.ts`
- utility shorthand maps (`cssProps`, `cssDirect`)

6. `src/builder/style-generator.ts`
- parser rules, units, pseudo/media handling, nested selector behavior

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
