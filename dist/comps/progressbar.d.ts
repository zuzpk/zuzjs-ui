import { BaseProps } from "../types/interfaces";
import { PROGRESS } from "../types/enums";
export interface ProgressBarProps {
    progress: number;
    type?: PROGRESS;
}
export interface ProgressHandler {
    setWidth?: (w: number) => void;
}
declare const ProgressBar: import("react").ForwardRefExoticComponent<ProgressBarProps & BaseProps & import("react").RefAttributes<ProgressHandler>>;
export default ProgressBar;
