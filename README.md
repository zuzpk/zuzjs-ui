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