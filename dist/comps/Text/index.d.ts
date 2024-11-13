import { HTMLAttributes, ReactNode } from 'react';
import { Props } from '../../types';
export type TextProps = Props<`h1` | `h2` | `h3` | `h4` | `h5` | `h6`> & {
    h?: number;
    html?: ReactNode | string;
};
declare const Text: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref">, keyof import("../../types").ZuzProps> & {
    h?: number;
    html?: ReactNode | string;
} & import("react").RefAttributes<HTMLHeadingElement>>;
export default Text;
