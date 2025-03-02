import { PROGRESS } from "../../types/enums";
import { BoxProps } from "../Box";
export type ProgressBarProps = BoxProps & {
    progress?: number;
    type?: PROGRESS;
};
export interface ProgressHandler {
    setWidth?: (w: number) => void;
}
