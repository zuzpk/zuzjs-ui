import { Ref } from "react";
import { BundledLanguage } from "shiki";
import { ZuzProps } from "../../types";

export type CodeLanguage = BundledLanguage | 'plain';

export interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>,
    code: string;
    lang?: CodeLanguage;
    showLines?: boolean;
    highlight?: string;
    copy?: {
        onCopy?: () => void,
        icon?: string
    }
}
