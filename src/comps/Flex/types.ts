import { BoxProps } from "../../types";

export type FlexProps = BoxProps & {
    /** Shortcut for flex-direction: column */
    cols?: boolean;
    /** Shortcut for gap */
    gap?: number | string;
    /** Shortcut for align-items: center */
    aic?: boolean;
    /** Shortcut for justify-content: center */
    jcc?: boolean;
};