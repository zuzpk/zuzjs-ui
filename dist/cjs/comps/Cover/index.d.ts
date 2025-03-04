import { SPINNER } from "../../types/enums";
import { BoxProps } from "../Box";
export type CoverProps = BoxProps & {
    message?: string;
    spinner?: SPINNER;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
};
declare const Cover: import("react").ForwardRefExoticComponent<BoxProps & {
    message?: string;
    spinner?: SPINNER;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Cover;
