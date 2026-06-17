import { dynamic, ValueOf } from "../../types";
import { BoxProps } from "../../types/interfaces";
import { SheetHandler } from "../Sheet";
import { SPINNER } from "../Spinner/types";

export type ValidationSchema = Record<string, (value: any, allValues: dynamic) => string | null | boolean>;

export type ValidationResult = {
    [key: string]: {
        valid: boolean;
        value: string;
    }
}

export type FormProps = Omit<BoxProps, `ref`> & {

    schema?: ValidationSchema;
    /** Name of form, will be appended to --form-{name} in className 
     * whitespace will be replaced with dash (-)
    */
    name?: string;
    /** The URL to which the form data is submitted */
    action?:  string;
    /** List of error messages for form validation */
    errors?: dynamic;
    /** Spinner properties for loading indicator */
    spinner?: ValueOf<typeof SPINNER>;
    /** Additional data to include with form submission */
    withData?: dynamic;
    /** Handler function called before form submission with validated form data */
    beforeSubmit?: (data: FormData | dynamic, validationResult: ValidationResult) => void;
    /** Handler function called on form submission with validated form data */
    onSubmit?: (data: FormData | dynamic, validationResult: ValidationResult) => void;
    /** Callback triggered upon successful form submission */
    onSuccess?: (data: dynamic, payload?: dynamic) => void;
    /** Callback triggered when form submission encounters an error */
    onError?: (error: any, validationResult: ValidationResult) => void;
    /** Cover properties to display loading or processing message */
    cover?: {
        /** Background color of the loading cover */
        color?: string;
        /** Message displayed during loading */
        message?: string;
    } | SheetHandler;

    resetOnSuccess?: boolean;
}

export type FormDataResult = {
    error: boolean,
    errorMsg: string,
    data: ValidationResult,
    payload: FormData | dynamic,
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
    /** Retrieves the current form data */
    getFormData: () => FormDataResult;
    /** Submits the form with optional additional data */
    submit: (more?: dynamic) => void;
}