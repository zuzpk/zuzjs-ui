import { Props } from "../../types";
import { RADIO, Size } from "../../types/enums";

export type RadioProps = Props<"input"> & { 
    type?: RADIO,
    size?: Size,
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void,
}

export interface RadioHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void,
    toggle: (triggerChange?: boolean) => void,
}