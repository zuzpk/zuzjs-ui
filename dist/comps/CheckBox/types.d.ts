import { Props } from "../../types";
import { CHECKBOX, Size } from "../../types/enums";
/**
 * Props for the CheckBox component.
 *
 * @typedef {Object} CheckBoxProps
 * @property {CHECKBOX} [type] - The type of the checkbox.
 * @property {Size} [size] - The size of the checkbox.
 * @property {(checked: boolean, value: string | number | readonly string[]) => void} [onChange] - Callback function triggered when the checkbox state changes.
 */
export type CheckBoxProps = Props<"input"> & {
    type?: CHECKBOX;
    size?: Size;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
};
/**
 * Interface for handling checkbox state.
 *
 * @interface CheckboxHandler
 * @property {(mode: boolean, triggerChange?: boolean) => void} setChecked - Sets the checked state of the checkbox.
 * @property {(triggerChange?: boolean) => void} toggle - Toggles the checked state of the checkbox.
 */
export interface CheckboxHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void;
    toggle: (triggerChange?: boolean) => void;
}
