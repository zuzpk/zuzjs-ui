import { Ref } from "react";
import { BoxProps, SLIDER, ValueOf } from "../../types";

export interface SliderController {

}

export type SliderProps = Omit<BoxProps, `ref`> & {
    ref?: Ref<SliderController>,
    type?: ValueOf<typeof SLIDER>,
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    roundValue?: boolean,
    showKnobOnHover?: boolean,
    showGhostBar?: boolean,
    showToolTip?: boolean,
    formatValue?: (value: number) => string | number,
    onChange?: (value: number) => void,
}