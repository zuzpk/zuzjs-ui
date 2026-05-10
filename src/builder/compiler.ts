/**
 * ZuzBuilder Compiler
 *
 * generatePageSource(tree, options) → string
 *
 * Traverses a ZuzNode tree and emits a complete, HMR-ready Next.js page
 * as a valid ESM TypeScript/JSX string.  Output rules:
 *
 *  - No div soup: only <Flex> and <Box> (plus explicit leaf components).
 *  - All visual styling is expressed as atomic shorthand in the `as` prop.
 *  - Imports are auto-detected from the tree and deduplicated.
 *  - Grid nodes → <Flex as="grid gtc:[repeat(N,1fr)] gap:…"> wrappers.
 *  - Component nodes → the named @zuzjs/ui component with forwarded props.
 */

import type {
    CompilerOptions,
    ZuzComponentName,
    ZuzNode,
    ZuzTree,
} from "./zuz-node";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normalise the `as` field to a quoted JSX attribute string. */
function serializeAs(as: ZuzNode["as"]): string {
    if (!as) return "";
    const tokens = Array.isArray(as) ? as.join(" ") : as;
    return `as="${tokens}"`;
}

/** Serialise an arbitrary props record to JSX attribute strings. */
function serializeProps(props: Record<string, unknown>): string {
    return Object.entries(props)
        .map(([key, value]) => {
            if (value === true) return key;
            if (value === false) return `${key}={false}`;
            if (typeof value === "number") return `${key}={${value}}`;
            if (typeof value === "string") return `${key}="${escapeString(value)}"`;
            // Objects / arrays → JSX expression
            return `${key}={${JSON.stringify(value)}}`;
        })
        .join(" ");
}

/** Minimal string escaping for JSX attribute values. */
function escapeString(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Derive the CSS-grid column template shorthand for a grid node.
 * Uses the @zuzjs/ui bracket syntax: gtc:[repeat(N,1fr)]
 */
function gridAsTokens(columns: number, as?: ZuzNode["as"]): string {
    const base = Array.isArray(as) ? [...as] : as ? as.split(" ") : [];

    // Ensure `grid` direct-shortcut is present
    if (!base.includes("grid")) base.unshift("grid");

    // Inject column template if not manually set
    const hasGtc = base.some((t) => t.startsWith("gtc:"));
    if (columns > 1 && !hasGtc) {
        base.push(`gtc:[repeat(${columns},1fr)]`);
    }

    return base.join(" ");
}

// ─── Collector pass: gather all component names used in the tree ──────────────

function collectImports(node: ZuzNode, found: Set<ZuzComponentName>): void {
    if (node.type === "grid") {
        found.add("Flex");
    } else if (node.type === "component" && node.component) {
        found.add(node.component);
    }
    node.children?.forEach((child) => collectImports(child, found));
}

// ─── Render pass: convert each node to a JSX string ─────────────────────────

function renderNode(node: ZuzNode, depth: number, indent: string): string {
    const pad = indent.repeat(depth);
    const childPad = indent.repeat(depth + 1);

    // ── Grid node ──────────────────────────────────────────────────────────
    if (node.type === "grid") {
        const columns = (node as any).columns ?? 1;
        const asValue = gridAsTokens(columns, node.as);
        const asAttr = asValue ? `as="${asValue}"` : "";

        const extraProps = node.props ? ` ${serializeProps(node.props)}` : "";

        if (!node.children || node.children.length === 0) {
            return `${pad}<Flex ${asAttr}${extraProps} />`;
        }

        const renderedChildren = node.children
            .map((child) => renderNode(child, depth + 1, indent))
            .join("\n");

        return [
            `${pad}<Flex ${asAttr}${extraProps}>`,
            renderedChildren,
            `${pad}</Flex>`,
        ].join("\n");
    }

    // ── Component node ────────────────────────────────────────────────────
    const tag = node.component ?? "Box";
    const asAttr = serializeAs(node.as);
    const extraProps = node.props ? serializeProps(node.props) : "";

    // Build attribute string, filtering empty parts
    const attrs = [asAttr, extraProps].filter(Boolean).join(" ");
    const attrStr = attrs ? ` ${attrs}` : "";

    // Text content (special-case for Text / Span / Button)
    const textContent =
        typeof node.props?.children === "string" ? node.props.children : null;

    const hasJsxChildren =
        node.children && node.children.length > 0;

    if (!hasJsxChildren && !textContent) {
        return `${pad}<${tag}${attrStr} />`;
    }

    if (textContent && !hasJsxChildren) {
        return `${pad}<${tag}${attrStr}>${textContent}</${tag}>`;
    }

    const renderedChildren = [
        textContent ? `${childPad}{/* ${textContent} */}` : null,
        ...(node.children ?? []).map((c) => renderNode(c, depth + 1, indent)),
    ]
        .filter(Boolean)
        .join("\n");

    return [
        `${pad}<${tag}${attrStr}>`,
        renderedChildren,
        `${pad}</${tag}>`,
    ].join("\n");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compile a ZuzNode tree into a complete Next.js page source string.
 *
 * @example
 * ```ts
 * const source = generatePageSource(myTree);
 * fs.writeFileSync("app/(generated)/home/page.tsx", source);
 * ```
 */
export function generatePageSource(
    tree: ZuzTree,
    options: CompilerOptions = {}
): string {
    const {
        indent = "  ",
        componentName = "GeneratedPage",
    } = options;

    // ── Collect imports ──
    const usedComponents = new Set<ZuzComponentName>();
    collectImports(tree.root, usedComponents);

    // Allow caller to override / extend imports
    if (options.imports) {
        options.imports.forEach((name) => usedComponents.add(name));
    }

    const importLine =
        usedComponents.size > 0
            ? `import { ${[...usedComponents].sort().join(", ")} } from "@zuzjs/ui";`
            : "";

    // ── Render root ──
    const bodyJsx = renderNode(tree.root, 1, indent);

    // ── Assemble file ──
    const lines = [
        `"use client";`,
        ``,
        importLine,
        ``,
        `/**`,
        ` * ${componentName}`,
        ` * Auto-generated by ZuzBuilder – do not edit manually.`,
        ` * Source tree id: ${tree.id}`,
        ` */`,
        `export default function ${componentName}() {`,
        `${indent}return (`,
        bodyJsx,
        `${indent});`,
        `}`,
        ``,
    ];

    return lines.filter((l) => l !== null).join("\n");
}

/**
 * Compile a standalone ZuzNode subtree fragment into a JSX string.
 * Useful for previewing individual regions without full page scaffolding.
 */
export function generateFragment(
    node: ZuzNode,
    options: CompilerOptions = {}
): string {
    const { indent = "  " } = options;
    return renderNode(node, 0, indent);
}
