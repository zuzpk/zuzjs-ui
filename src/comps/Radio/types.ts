import { Props, ValueOf } from "../../types";
import { RADIO, Variant } from "../../types/enums";

export type RadioProps = Props<"input"> & { 
    type?: ValueOf<typeof RADIO>,
    size?: ValueOf<typeof Variant>,
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void,
}

export interface RadioHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void,
    toggle: (triggerChange?: boolean) => void,
}