"use client"
import { copyToClipboard } from '@zuzjs/core';
import { RefObject, useMemo, useRef } from 'react';
import useBase from '../../hooks/useBase';
import Box from '../Box';
import Button from '../Button';
import { CodeBlockProps } from './types';

/**
 * CodeBlock component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <CodeBlock language="tsx">const greeting = "Hello World";</CodeBlock>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <CodeBlock language="tsx" showLineNumbers copyable highlight={[2, 5]}>const greet = () => console.log("Hi");<br/>greet();</CodeBlock>
 * ```
 * @param language - language prop
 * @param showLineNumbers - showLineNumbers prop
 * @param copyable - copyable prop
 * @param highlight - highlight prop
 */
const CodeBlock = ({
    ref,
    ...props
} : CodeBlockProps) => {

    const { 
        code,
        copy,
        lang = 'tsx', 
        showLines = false, 
        highlight = "",
        as, 
        fx, 
        ...pops 
    } = props;

    const innerRef = useRef<HTMLPreElement>(null);

    const { 
        className, 
        style, 
        rest
    } = useBase<`pre`>({ 
        as: `rel p:20 br:8 bg:shade-1 overflow:auto font:mono ${as}`, 
        fx 
    }, innerRef as RefObject<HTMLElement>);

    // 1. Parse Highlight Ranges (e.g., "2,4-6" -> [2, 4, 5, 6])
    const highlightedLines = useMemo(() => {
        const lines = new Set<number>();
        highlight.split(',').forEach(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                for (let i = start; i <= end; i++) lines.add(i);
            } else if (part) lines.add(Number(part));
        });
        return lines;
    }, [highlight]);

    // 2. The Robust Line Processor
    const processedHtml = useMemo(() => {
        // 1. Better Indent Cleaning: Split and remove leading/trailing empty lines
        const lines = code.split('\n');
        while (lines.length > 0 && lines[0].trim() === "") lines.shift();
        while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

        // 2. Find the indentation of the first line to use as the "Master Indent"
        const firstLineIndent = lines[0]?.match(/^\s*/)?.[0].length || 0;
        
        // 3. Strip that exact amount from every line
        const cleanLines = lines.map(line => {
            const currentIndent = line.match(/^\s*/)?.[0].length || 0;
            // Don't slice more than the line actually has (for empty/short lines)
            const sliceAmount = Math.min(currentIndent, firstLineIndent);
            return line.slice(sliceAmount);
        });

        const rules = [
            // Comments: avoid matching URLs (e.g., https://...)
            { name: 'comm', re: /(^|\s)(?!https?:)\/\/.*$/gm },
            // Strings
            { name: 'str',  re: /(["'`])(?:(?=(\\?))\2.)*?\1/g },
            // Brackets (each type as its own token)
            { name: 'paren', re: /[()]/g },
            { name: 'curly', re: /[{}]/g },
            { name: 'square', re: /[\[\]]/g },
            // Keywords (expanded)
            { name: 'key',  re: /\b(const|let|var|export|default|import|from|return|if|else|switch|case|break|as|type|interface|class|extends|await|async|new|void|typeof|function|try|catch|finally|throw|for|while|do|continue|static|get|set|public|private|protected|package|implements|instanceof|in|of|super|this|delete|yield|with|true|false|null|undefined|NaN|Infinity)\b/g },
            // Function calls and special identifiers (connectApp, etc.)
            { name: 'fn',   re: /\b([a-zA-Z_][\w]*)\s*(?=\()/g },
            // PascalCase variables/classes
            { name: 'var',  re: /(?<!&lt;\/|&lt;)\b[A-Z][A-Za-z0-9_]*\b/g },
            // Properties
            { name: 'prop', re: /\.([a-z_][\w]*)\b/gi },
            // Numbers (int, float, hex, binary, octal)
            { name: 'num',  re: /\b(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d*\.\d+|\d+)\b/g }
        ];

        // Custom handler for import { ... } to highlight identifiers inside braces
        function highlightImportIds(html: string) {
            return html.replace(/import\s*\{([^}]*)\}/g, (m, ids) => {
                const highlighted = ids.split(',').map((id: string) => `<span class=\"--token-key\">${id.trim()}</span>`).join(', ');
                return m.replace(ids, highlighted);
            });
        }

        return cleanLines.map((line, index) => {

            let html = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const isHighlighted = highlightedLines.has(index + 1);

            if ( lang != `plain` ){
                // To avoid nested tokens, process one rule at a time, replacing only non-overlapping matches
                // We'll use a simple approach: for each rule, split the string by existing spans, and only apply to plain text
                rules.forEach(rule => {
                    // Split by existing spans
                    let parts = html.split(/(<span class=\"--token-[^>]+>.*?<\/span>)/g);
                    parts = parts.map(part => {
                        // Only apply to non-token parts
                        if (part.startsWith('<span class')) return part;
                        return part.replace(rule.re, (m) => `<span class=\"--token-${rule.name}\">${m}</span>`);
                    });
                    html = parts.join('');
                });
                // Now handle import { ... } highlighting
                html = highlightImportIds(html);
            }

            return `<div class="--code-line ${showLines == true ? `--with-ln` : ``} ${isHighlighted ? '--is-highlighted' : ''}">
                ${showLines == true ? `<span class="--line-number">${index + 1}</span>` : ``}
                <span class="--line-content">${html || ' '}</span>
            </div>`;
        }).join('');
    }, [code, highlightedLines]);

    return <Box 
        as={`--code-block rel ${className}`} 
        style={style}
        {...pops}>
        <pre 
            ref={ref}>
            <code 
                className={`--code --lang-${lang}`}
                dangerouslySetInnerHTML={{ __html: processedHtml }} 
            />
        </pre>
        { copy && <Button as={`--copy-code abs`} onClick={() => {
            copyToClipboard(code);
            copy.onCopy?.()
        }}>Copy</Button> }
    </Box>
}

export default CodeBlock;