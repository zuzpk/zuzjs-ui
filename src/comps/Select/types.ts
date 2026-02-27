import { FormEventHandler, ReactNode, Ref } from "react"
import { BoxProps, FORMVALIDATION, ValueOf, Variant } from "../../types"

/**
 * Interface for the Select component handle, accessible via React ref.
 * 
 * @example
 * ```tsx
 * const selectRef = useRef<SelectHandler>(null);
 * // ...
 * selectRef.current?.setSelected("option-value");
 * ```
 */
export interface SelectHandler {
    /**
     * Programmatically sets the selected option.
     * @param option - The option object or value string to select.
     */
    setSelected: ( option: Option | string | Option[] | string[] ) => void,
    /**
     * Retrieves the currently selected option object.
     * @returns The selected Option or null if nothing is selected.
     */
    getValue: () => Option | Option[] | null,
}

/**
 * Represents an individual option within the Select component.
 */
export type Option = {
    /** Optional icon to display next to the label. Can be a string (URL/Path) or a ReactNode. */
    icon?: string | ReactNode,
    /** Optional color for the icon. */
    iconColor?: string,
    /** The display text for the option. */
    label: string,
    /** The underlying value for the option. */
    value: string | number,
    /** Optional flag to disable this specific option. */
    disabled?: boolean,
}

/**
 * Represents an option object with a label and value.
 */
export type Value = FormEventHandler<HTMLDivElement> & Option

export interface OptionItemProps {
    updateValue: (o: Option) => void, 
    o: Option,
    // value: Option,
    selected?: boolean,
    checkIcon?: string | ReactNode,
}

/**
 * Props for the Select component.
 */
export type SelectProps = Omit<BoxProps, "onChange" | "ref"> & {


    ref?: Ref<SelectHandler>,

    /**
     * Size of the select field.
     * @default "sm"
     */
    variant?: ValueOf<typeof Variant>,

    /**
     * Indicates if the select field is required and its validation type.
     */
    required?: ValueOf<typeof FORMVALIDATION>,

    /**
     * Array of options to be displayed in the select dropdown.
     * * @example
     * ```tsx
     * [
     *  {
     *      icon:  "apple",
     *      iconColor: "#ff0000",
     *      label: "Apple",
     *      value: "apple",
     *  }
     * ]
     * ```
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
    searchPlaceholder?: string,

    /**
     * Expand width to parent 100%
     * width:100%
     */
    expanded?: boolean,

    /**
     * Max Height
     */
    maxHeight?: number,

    arrowDownIcon?: string | ReactNode,

    arrowUpIcon?: string | ReactNode,

    disabled?: boolean,

    multiple?: boolean,
    
    tokenizer?: boolean,

    wrapTokens?: boolean,

    checkIcon?: string | ReactNode,

    closeIcon?: string | ReactNode,
    
}