import { Props } from '../../types';
export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean;
};
declare const TextArea: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">, keyof import("../../types").ZuzProps> & {
    autoResize?: boolean;
} & import("react").RefAttributes<HTMLTextAreaElement>>;
export default TextArea;
