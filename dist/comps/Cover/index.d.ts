import { BoxProps } from "../Box";
import { SpinnerProps } from "../Spinner";
export type CoverProps = BoxProps & {
    message?: string;
    spinner?: SpinnerProps;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
};
declare const Cover: import("react").ForwardRefExoticComponent<BoxProps & {
    message?: string;
    spinner?: SpinnerProps;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Cover;
