import { BoxProps } from "../Box";
import { dynamicObject } from "../../types";
import { SheetHandler } from "../Sheet";
import { SPINNER } from "../../types/enums";
export type FormProps = BoxProps & {
    /** Name of form, will be appended to --form-{name} in className
     * whitespace will be replaced with dash (-)
    */
    name?: string;
    /** The URL to which the form data is submitted */
    action?: string;
    /** List of error messages for form validation */
    errors?: dynamicObject;
    /** Spinner properties for loading indicator */
    spinner?: SPINNER;
    /** Additional data to include with form submission */
    withData?: dynamicObject;
    /** Handler function called before form submission with validated form data */
    beforeSubmit?: (data: FormData | dynamicObject) => void;
    /** Handler function called on form submission with validated form data */
    onSubmit?: (data: FormData | dynamicObject) => void;
    /** Callback triggered upon successful form submission */
    onSuccess?: (data: dynamicObject) => void;
    /** Callback triggered when form submission encounters an error */
    onError?: (error: any) => void;
    /** Cover properties to display loading or processing message */
    cover?: {
        /** Background color of the loading cover */
        color?: string;
        /** Message displayed during loading */
        message?: string;
    } | SheetHandler;
    resetOnSuccess?: boolean;
};
/**
 * Exposes control methods for the Form component, such as setting loading states or hiding errors.
 */
export interface FormHandler {
    /** Sets the loading state of the form */
    setLoading: (mode: boolean) => void;
    /** Hides any currently displayed error message */
    hideError: () => void;
    /** Resets the form to its initial state */
    init: () => void;
}
/**
 * {@link Form} is a controlled component designed to handle form data submission, validation, and display of loading or error states.
 * It allows for optional server-side submission through an action endpoint and customizable success/error handling callbacks.
 *
 * The component also provides an interface for controlling loading and error states from a parent component using {@link FormHandler}.
 *
 * @param props - Properties to configure form behavior, validation messages, submission handling, and visual feedback.
 * @param ref - Reference to the {@link FormHandler} interface, exposing methods to control loading and error states from the parent.
 */
declare const Form: import("react").ForwardRefExoticComponent<BoxProps & {
    /** Name of form, will be appended to --form-{name} in className
     * whitespace will be replaced with dash (-)
    */
    name?: string;
    /** The URL to which the form data is submitted */
    action?: string;
    /** List of error messages for form validation */
    errors?: dynamicObject;
    /** Spinner properties for loading indicator */
    spinner?: SPINNER;
    /** Additional data to include with form submission */
    withData?: dynamicObject;
    /** Handler function called before form submission with validated form data */
    beforeSubmit?: (data: FormData | dynamicObject) => void;
    /** Handler function called on form submission with validated form data */
    onSubmit?: (data: FormData | dynamicObject) => void;
    /** Callback triggered upon successful form submission */
    onSuccess?: (data: dynamicObject) => void;
    /** Callback triggered when form submission encounters an error */
    onError?: (error: any) => void;
    /** Cover properties to display loading or processing message */
    cover?: {
        /** Background color of the loading cover */
        color?: string;
        /** Message displayed during loading */
        message?: string;
    } | SheetHandler;
    resetOnSuccess?: boolean;
} & import("react").RefAttributes<FormHandler>>;
export default Form;
