import { Props } from "../../types";
import { Size } from "../../types/enums";
import { SpinnerProps } from "../Spinner";
export type ButtonProps = Props<`button`> & {
    icon?: string;
    iconSize?: Size;
    withLabel?: boolean;
    spinner?: SpinnerProps;
    state?: ButtonState;
    size?: Size;
    reset?: boolean;
};
export interface ButtonHandler extends HTMLButtonElement {
    reset: () => void;
    setState: (mod: ButtonState) => void;
}
export declare enum ButtonState {
    Loading = "loading",
    Normal = "normal"
}
