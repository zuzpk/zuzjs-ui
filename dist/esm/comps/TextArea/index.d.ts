import { Props } from '../../types';
import { Variant } from '../../types/enums';
export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean;
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`;
    variant?: Variant;
};
declare const TextArea: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">, keyof import("../..").ZuzProps> & {
    autoResize?: boolean;
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`;
    variant?: Variant;
} & import("react").RefAttributes<HTMLTextAreaElement>>;
export default TextArea;
