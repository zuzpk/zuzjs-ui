import { FormEventHandler } from "react"
import { FORMVALIDATION, Variant } from "../../types/enums"
import { BoxProps } from "../Box"

/**
 * Represents an option which can be either a string or an OptionObject.
 */
export type Option = {
    label: string,
    value: string
}

/**
 * Represents an option object with a label and value.
 */
export type Value = FormEventHandler<HTMLDivElement> & Option

export interface OptionItemProps {
    updateValue: (o: Option) => void, 
    o: Option,
    value: Option
}

/**
 * Props for the Select component.
 */
export type SelectProps = Omit<BoxProps, "onChange" > & {


    /**
     * Size of the select field.
     * @default "md"
     */
    variant?: Variant,

    /**
     * Indicates if the select field is required and its validation type.
     */
    required?: FORMVALIDATION,

    /**
     * Array of options to be displayed in the select dropdown.
     */
    options: Option[],

    /**
     * Label for the select field.
     */
    label?: string,

    /**
     * The currently selected option.
     */
    selected?: string | Option,

    /**
     * Enables the search functionality within the select dropdown.
     */
    search?: boolean,

    /**
     * Callback function triggered when the selected option changes.
     * @param v - The newly selected option.
     */
    onChange?: (v : Option) => void,

    /**
     * Placeholder text for the search input field.
     */
    searchPlaceholder?: string
}