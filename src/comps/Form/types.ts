import { dynamicObject, SheetHandler, SPINNER } from "../..";
import { BoxProps } from "../Box";

export type FormProps = BoxProps & {
    /** Name of form, will be appended to --form-{name} in className 
     * whitespace will be replaced with dash (-)
    */
    name?: string;
    /** The URL to which the form data is submitted */
    action?:  string;
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
}

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

    submit: () => void;
}