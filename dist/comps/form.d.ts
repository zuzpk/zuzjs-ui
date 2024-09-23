import { animationProps } from "./base";
import { SpinnerProps } from "./spinner";
import { dynamicObject } from "../types";
export interface FormProps {
    as?: string;
    animate?: animationProps;
    action?: string;
    errors?: string[];
    spinner?: SpinnerProps;
    withData?: dynamicObject;
    onSubmit?: (data: FormData | dynamicObject) => void;
    onSuccess?: (data: dynamicObject) => void;
    onError?: (error: any) => void;
    cover?: {
        color?: string;
        message?: string;
    };
}
export interface FormHandler {
    setLoading: (mode: boolean) => void;
}
declare const Form: import("react").ForwardRefExoticComponent<FormProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<FormHandler>>;
export default Form;
