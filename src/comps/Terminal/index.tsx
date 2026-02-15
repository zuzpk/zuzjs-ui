import { KeyboardEvent, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types";
import Box from "../Box";
import Input from "../Input";
import Span from "../Span";
import Text from "../Text";
import { TerminalHandler, TerminalLine, TerminalProps } from "./types";

const Terminal = ({ 
    ref,
    commands,
    onCommand, 
    welcomeMessage = "Welcome to Zuz Terminal v1.0.0", 
    prompt = "zuz ~ ",
    variant,
    ...props 
}: TerminalProps & {
    ref?: Ref<TerminalHandler>
}) => {

    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'output', content: welcomeMessage }
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { variant : themeVariant } = useTheme(true)!
    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const write = (line: TerminalLine | string) => {
        const newLine: TerminalLine = typeof line === 'string' 
            ? { type: 'output' as const, content: line } // Use 'as const' here
            : line;

        setHistory(prev => {
            const updated = [...prev, newLine];
            return updated.length > 1000 ? updated.slice(-1000) : updated;
        });
    };

    const clear = () => setHistory([]);
    
    useImperativeHandle(ref, () => ({
        write,
        clear
    }));

    const processCommand = async (input: string) => {
        const [cmd, ...args] = input.split(" ");
        const commandKey = cmd.toLowerCase();

        // 1. Check direct commands object
        if (commands && commands[commandKey]) {
            return await commands[commandKey](args);
        }

        // 2. Fallback to onCommand prop
        if (onCommand) {
            return await onCommand(input);
        }

        return `command not found: ${cmd}`;
    };

    const parseAnsi = (text: string) => {
        const pattern = /\u001b\[(\d+)m/g;
        const segments: { text: string; color?: string; bold?: boolean }[] = [];
        
        const colorMap: Record<string, string> = {
            "31": "#ff5f56", // red
            "32": "#27c93f", // green
            "33": "#ffbd2e", // yellow
            "34": "#007aff", // blue
            "35": "#ff79c6", // magenta
            "36": "#8be9fd", // cyan (ZPanel color)
            "39": "#d4d4d4", // reset to gray
        };

        let lastIndex = 0;
        let currentColor = "#d4d4d4"; // Start with default color immediately
        let isBold = false;
        let match;

        while ((match = pattern.exec(text)) !== null) {
            // Capture text BEFORE the match
            const part = text.slice(lastIndex, match.index);
            if (part) {
                segments.push({ text: part, color: currentColor, bold: isBold });
            }

            const code = match[1];
            if (code === "0") { 
                currentColor = "#d4d4d4"; 
                isBold = false; 
            } else if (code === "1") { 
                isBold = true; 
            } else if (colorMap[code]) { 
                currentColor = colorMap[code]; 
            }
            
            lastIndex = pattern.lastIndex;
        }

        // Capture remaining text AFTER the last match
        const remaining = text.slice(lastIndex);
        if (remaining) {
            segments.push({ text: remaining, color: currentColor, bold: isBold });
        }

        return segments;
    };

    const renderContent = (content: string, type: string) => {
        // If it contains ANSI codes (start with ESC), parse it
        if (content.includes('\u001b')) {
            return parseAnsi(content).map((seg, i) => (
                <Span key={`--terminal-msg-${i}-${seg.text.replace(/\S+/g, `-`)}`} 
                    style={{ 
                        color: seg.color || `#d4d4d4`, 
                        fontWeight: seg.bold ? 'bold' : 'normal' 
                    }}>
                    {seg.text}
                </Span>
            ));
        }

        // Standard fallback for simple strings
        return <Span style={{ 
                color: type === 'error' ? '#ff5f56' : 
                    type === 'command' ? '#00ff00' : '#d4d4d4' 
            }}>{content}</Span>;
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            const cmd = input.trim();
            const newHistory: TerminalLine[] = [...history, { type: 'command', content: `${prompt}${cmd}` }];
            
            setInput(""); // Clear input immediately
            setHistory(newHistory);

            const result = await processCommand(cmd);
            setHistory(prev => [...prev, { type: 'output', content: result }]);
            // if (onCommand) {
            //     try {
            //         const result = await onCommand(cmd);
            //         setHistory(prev => [...prev, { type: 'output', content: result }]);
            //     } catch (err) {
            //         setHistory(prev => [...prev, { type: 'error', content: String(err) }]);
            //     }
            // }
        }
    };

    return (
        <Box 
            as={`--zuz-terminal --${variant || themeVariant || Variant.Medium} flex cols ${props.className}`}
            onClick={() => inputRef.current?.focus()}>
                
            {/* Scrollable Area */}
            <Box ref={scrollRef} className={`--terminal-log`}>
                {history.map((line, i) => (
                    <Box key={i}>
                        <Text>
                            {renderContent(line.content, line.type)}
                        </Text>
                    </Box>
                ))}
            </Box>

            {/* Input Line */}
            <Box as="flex aic --terminal-input">
                <Text as="--terminal-prompt">{prompt}</Text>
                <Input
                    ref={inputRef}
                    className="--zuz-term-input"
                    autoFocus
                    value={input}
                    variant={variant || themeVariant || Variant.Medium}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Box>
        </Box>
    );
};

export default Terminal;