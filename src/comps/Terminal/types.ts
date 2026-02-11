import { ValueOf, Variant } from "../../types";

export interface TerminalHandler {
    write: (line: TerminalLine | string) => void;
    clear: () => void;
}

export type TerminalLine = {
    type: 'command' | 'output' | 'error' | 'success';
    content: string;
};

export interface TerminalProps {
    commands?: TerminalCommands;
    onCommand?: (cmd: string) => string | Promise<string>;
    welcomeMessage?: string;
    prompt?: string;
    className?: string;
    variant?: ValueOf<typeof Variant>;
}

export type TerminalCommandFn = (args: string[]) => string | Promise<string>;

export type TerminalCommands = Record<string, TerminalCommandFn>;