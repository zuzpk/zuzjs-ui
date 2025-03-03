import { BoxProps } from "../Box";
import { ProgressHandler } from "./types";
declare const ProgressBar: import("react").ForwardRefExoticComponent<BoxProps & {
    progress?: number;
    type?: import("../..").PROGRESS;
} & import("react").RefAttributes<ProgressHandler>>;
export default ProgressBar;
