import { Props } from '../../types';
import { Variant } from '../../types/enums';
export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean;
    variant?: Variant;
};
declare const TextArea: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">, keyof import("../../types").ZuzProps> & {
    autoResize?: boolean;
    variant?: Variant;
} & import("react").RefAttributes<HTMLTextAreaElement>>;
export default TextArea;
