import { dynamicObject } from "../../types";
import { SheetHandler } from "../Sheet";
import { FormHandler } from "./types";
/**
 * {@link Form} is a controlled component designed to handle form data submission, validation, and display of loading or error states.
 * It allows for optional server-side submission through an action endpoint and customizable success/error handling callbacks.
 *
 * The component also provides an interface for controlling loading and error states from a parent component using {@link FormHandler}.
 *
 * @param props - Properties to configure form behavior, validation messages, submission handling, and visual feedback.
 * @param ref - Reference to the {@link FormHandler} interface, exposing methods to control loading and error states from the parent.
 */
declare const Form: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
    name?: string;
    action?: string;
    errors?: dynamicObject;
    spinner?: import("../..").SPINNER;
    withData?: dynamicObject;
    beforeSubmit?: (data: FormData | dynamicObject) => void;
    onSubmit?: (data: FormData | dynamicObject) => void;
    onSuccess?: (data: dynamicObject) => void;
    onError?: (error: any) => void;
    cover?: {
        color?: string;
        message?: string;
    } | SheetHandler;
    resetOnSuccess?: boolean;
} & import("react").RefAttributes<FormHandler>>;
export default Form;
