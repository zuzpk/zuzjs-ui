import { Ref } from "react";
import { ZuzProps } from "../../types";

export interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>,
    code: string;
    lang?: `plain` | 'typescript' | 'javascript' | 'jsx' | 'tsx' | 'css' | 'json';
    showLines?: boolean;
    highlight?: string;
    copy?: {
        onCopy?: () => void,
        icon?: string
    }
}