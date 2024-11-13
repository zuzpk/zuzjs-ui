import { Props } from "../../types";
import { CHECKBOX } from "../../types/enums";

export type CheckBoxProps = Props<"input"> & { 
    type?: CHECKBOX, 
    onChange?: (checked: boolean, value: string | number | readonly string[]) => void,
}

export interface CheckboxHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void,
    toggle: (triggerChange?: boolean) => void,
}