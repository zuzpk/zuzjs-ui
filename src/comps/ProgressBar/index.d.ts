import { ProgressHandler } from "./types";
import { BoxProps } from "../Box";
declare const ProgressBar: import("react").ForwardRefExoticComponent<BoxProps & {
    progress?: number;
    type?: import("../..").PROGRESS;
} & import("react").RefAttributes<ProgressHandler>>;
export default ProgressBar;
