import { Ref } from "react";
import { BundledLanguage, BundledTheme } from "shiki";
import { ZuzProps } from "../../types";

export type CodeLanguage = BundledLanguage | 'plain';

export interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>,
    code: string;
    lang?: CodeLanguage;
    showLines?: boolean;
    highlight?: string;
    theme?: BundledTheme,
    themeDark?: BundledTheme,
    themeLight?: BundledTheme,
    copy?: {
        onCopy?: () => void,
        icon?: string
    }
}
