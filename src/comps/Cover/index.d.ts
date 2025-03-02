import { BoxProps } from "../Box";
import { SPINNER } from "../../types/enums";
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
