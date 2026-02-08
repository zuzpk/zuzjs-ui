import { Ref } from "react";
import { ZuzProps } from "../../types";

export interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>,
    code: string;
    lang?: 'typescript' | 'javascript' | 'tsx' | 'css' | 'json';
    showLines?: boolean;
    highlight?: string;
}