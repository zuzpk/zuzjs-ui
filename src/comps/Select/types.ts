import { FormEventHandler, ReactNode, Ref } from "react";
import { BoxProps, ValueOf, Variant } from "../../types";

export type SelectPrimitive = string | number
export type SelectSingleValue = Option | SelectPrimitive
export type SelectValue = SelectSingleValue | Option[] | SelectPrimitive[] | null
export type SelectSingleChange = Option
export type SelectEditableChange = Option | SelectPrimitive
export type SelectMultipleChange = Option[]

/**
 * Ref handle exposed by `Select`.
 *
 * @example
 * ```tsx
 * const selectRef = useRef<SelectHandler>(null)
 *
 * <Select ref={selectRef} options={options} label="Status" />
 *
 * selectRef.current?.setSelected("in-progress")
 * const selected = selectRef.current?.getValue()
 * ```
 */
export interface SelectHandler {
    /**
     * Programmatically sets the selected value.
     *
     * Accepts option objects, primitive values, arrays, or `null`.
     * @param option - The next value to set.
     */
    setSelected: ( option: SelectValue ) => void,
    /**
     * Returns the current selected value.
     * @returns Current `Option`, array of `Option`, primitive value, or `null`.
     */
    getValue: () => Option | Option[] | SelectPrimitive | null,
}

/**
 * Represents a selectable option.
 *
 * @example
 * ```tsx
 * const options: Option[] = [
 *   { label: "Todo", value: "todo" },
 *   { label: "In Progress", value: "in-progress", icon: "clock" },
 *   { label: "Done", value: "done", disabled: true }
 * ]
 * ```
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
    /** Special value parameter for categorization or grouping or passing additional metadata. */
    tag?: string;
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

type SelectCommonProps = Omit<BoxProps, "onChange" | "ref"> & {


    ref?: Ref<SelectHandler>,

    /**
     * Size of the select field.
     * @default "sm"
     */
    variant?: ValueOf<typeof Variant>,

    /**
     * Indicates if the select field is required and its validation type.
     */
    // required?: ValueOf<typeof FORMVALIDATION>,
    required?: boolean,

    // with?: WithFormValidation,

    /**
     * Array of options to be displayed in the select dropdown.
        *
        * @example
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
     * Enables the search functionality within the select dropdown.
     */
    search?: boolean,

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

    wrapTokens?: boolean,

    checkIcon?: string | ReactNode,

    closeIcon?: string | ReactNode,
}

type SelectChangeValue<
    TMultiple extends boolean,
    TTokenizer extends boolean,
    TEditable extends boolean,
> = TMultiple extends true
    ? SelectMultipleChange
    : TTokenizer extends true
        ? SelectMultipleChange
        : TEditable extends true
            ? SelectEditableChange
            : SelectSingleChange

type SelectSelectedValue<
    TMultiple extends boolean,
    TTokenizer extends boolean,
    TEditable extends boolean,
> = TMultiple extends true
    ? Option[] | SelectPrimitive[] | null
    : TTokenizer extends true
        ? Option[] | SelectPrimitive[] | null
        : TEditable extends true
            ? SelectSingleValue | null
            : SelectSingleValue | null

type SelectModeProps<
    TMultiple extends boolean,
    TTokenizer extends boolean,
    TEditable extends boolean,
> = TEditable extends true
    ? {
        multiple?: false,
        tokenizer?: false,
        editable: true,
        editablePlaceholder?: string,
    }
    : TMultiple extends true
        ? {
            /**
             * Enables multi-select behavior.
             *
             * @example
             * ```tsx
             * <Select label="Roles" options={roleOptions} multiple />
             * ```
             */
            multiple: true,
            tokenizer?: TTokenizer,
            editable?: false | undefined,
            editablePlaceholder?: never,
        }
        : TTokenizer extends true
            ? {
                /**
                 * Renders selected items as removable tokens.
                 */
                tokenizer: true,
                multiple?: TMultiple,
                editable?: false | undefined,
                editablePlaceholder?: never,
            }
            : {
                multiple?: false,
                tokenizer?: false,
                editable?: false | undefined,
                editablePlaceholder?: never,
            }

export type SelectProps<
    TMultiple extends boolean = false,
    TTokenizer extends boolean = false,
    TEditable extends boolean = false,
> = SelectCommonProps & SelectModeProps<TMultiple, TTokenizer, TEditable> & {
    /**
     * The currently selected option.
     */
    selected?: SelectSelectedValue<TMultiple, TTokenizer, TEditable>,

    /**
     * Callback function triggered when the selected option changes.
     */
    onChange?: (v: SelectChangeValue<TMultiple, TTokenizer, TEditable>) => void,
}

export type SelectSingleProps = SelectProps<false, false, false>
export type SelectEditableProps = SelectProps<false, false, true>
export type SelectMultipleProps = SelectProps<true, boolean, false>
export type SelectTokenizerProps = SelectProps<boolean, true, false>

export type SelectInternalProps = SelectCommonProps & {
    /**
     * The currently selected option.
     */
    selected?: SelectSingleValue | Option[] | SelectPrimitive[] | null,

    /**
     * Callback function triggered when the selected option changes.
     * @param v - The newly selected option.
        *
        * @example
        * ```tsx
        * onChange={(v) => {
        *   if (Array.isArray(v)) {
        *     console.log("Multi value", v.map(item => item.value))
        *   } else {
        *     console.log("Single value", v)
        *   }
        * }}
        * ```
     */
    onChange?: (v : Option | Option[] | SelectPrimitive) => void,

    /**
     * Enables multi-select behavior.
     *
     * @example
     * ```tsx
     * <Select label="Roles" options={roleOptions} multiple />
     * ```
     */
    multiple?: boolean,
    
    /**
     * Renders selected items as removable tokens.
     */
    tokenizer?: boolean,

    /**
     * Allows entering custom values when not in `multiple` or `tokenizer` mode.
     */
    editable?: boolean,

    editablePlaceholder?: string,
}

/**
 * Props for `Select`.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Fruit"
 *   options={[
 *     { label: "Apple", value: "apple" },
 *     { label: "Orange", value: "orange" }
 *   ]}
 *   selected="apple"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Select
 *   label="Tags"
 *   options={[
 *     { label: "UI", value: "ui" },
 *     { label: "Backend", value: "backend" }
 *   ]}
 *   multiple
 *   search
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Select
 *   label="Assignee"
 *   options={users}
 *   editable
 *   editablePlaceholder="Type a custom assignee"
 * />
 * ```
 */