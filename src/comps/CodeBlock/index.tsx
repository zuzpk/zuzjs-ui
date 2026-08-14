import { RefObject, useEffect, useRef, useState } from 'react';
import { codeToHtml } from 'shiki';
import { useBase, useTheme } from '../../hooks';
import Box from '../Box';
import { CodeBlockProps } from './types';

const CodeBlock = ({
    ref,
    ...props
} : CodeBlockProps) => {

    const { resolvedScheme } = useTheme(true)!;

    const { 
        code: rawCode,
        copy,
        lang = 'tsx', 
        showLines = false, 
        highlight = "",
        as, 
        fx,
        theme,
        themeDark,
        themeLight,
        ...pops 
    } = props;
    const shikiTheme = resolvedScheme === 'light'
        ? themeLight ?? theme ?? 'github-light'
        : themeDark ?? theme ?? 'github-dark';
    const innerRef = useRef<HTMLPreElement>(null);
    const [highlightedHtml, setHighlightedHtml] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState(false);

    const { 
        className, 
        style,
        rest
    } = useBase<`pre`>({ 
        as: `rel p:20 br:8 bg:shade-1 overflow:auto font:mono ${as}`, 
        fx 
    }, innerRef as RefObject<HTMLElement>);

    useEffect(() => {

        let cancelled = false;
        const highlightCode = async () => {
            
            setIsLoading(true);
            const language = lang === 'plain' ? 'text' : lang;

            try{
                
                const html = await codeToHtml(rawCode, {
                    lang: language as any,
                    theme: shikiTheme,
                    transformers: [
                        {
                            code(node) {
                                // Ensure code has proper styling
                                node.properties = node.properties || {};
                                node.properties.class = 'shiki-code';
                            },
                            // line(node, line) {
                            //     // Add line highlighting classes
                            //     const lineNum = line + 1;
                            //     // const isHighlighted = highlightedLines.has(lineNum);
                                
                            //     node.properties = node.properties || {};
                            //     const existingClass = node.properties.class || '';
                            //     node.properties.class = [
                            //         '--code-line',
                            //         showLines ? '--with-ln' : '',
                            //         // isHighlighted ? '--is-highlighted' : ''
                            //     ].filter(Boolean).join(' ') + ' ' + existingClass;
                                
                            //     node.properties['data-line'] = lineNum;
                            // }
                        }
                    ]
                });

                if (!cancelled) {
                    setHighlightedHtml(html);
                }

            }
            catch(error) {
                if (!cancelled) {
                    const escaped = rawCode
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .split('\n')
                        .map((line, i) => {
                            const lineNum = i + 1;
                            const lineClass = [
                                '--code-line',
                                showLines ? '--with-ln' : ''
                            ].filter(Boolean).join(' ');
                            const lineNumSpan = showLines 
                                ? `<span class="--line-number">${lineNum}</span>` 
                                : '';
                            return `<div class="${lineClass}" data-line="${lineNum}">${lineNumSpan}<span class="--line-content">${line || ' '}</span></div>`;
                        })
                        .join('');
                    setHighlightedHtml(escaped);
                }
            }
            finally {
                if (!cancelled) setIsLoading(false);
            }

        }

        highlightCode();
        return () => { cancelled = true; };

    }, [rawCode, lang, showLines, shikiTheme])

    return <Box
        as={`--code-block rel ${className}`} 
        style={style}
        {...pops}>
            <pre 
                ref={ref}
                className={`--shiki-pre --lang-${lang}`}
                dangerouslySetInnerHTML={{ 
                    __html: isLoading 
                        ? '<div class="--loading">Loading...</div>' 
                        : highlightedHtml || '<code></code>'
                }} 
            />
    </Box>
}

export default CodeBlock