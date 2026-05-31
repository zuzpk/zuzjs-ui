import { BoxProps } from "../../types";

export type FlexProps = BoxProps & {
    /** Shortcut for flex-direction: column */
    cols?: boolean;
    /** Shortcut for gap */
    gap?: number | string;
    /** Shortcut for align-self: flex-start */
    ass?: boolean;
    /** Shortcut for align-self: center */
    asc?: boolean;
    /** Shortcut for align-self: flex-end */
    ase?: boolean;
    /** Shortcut for align-items: center */
    ais?: boolean;
    /** Shortcut for align-items: flex-start */
    aic?: boolean;
    /** Shortcut for align-items: flex-end */
    aie?: boolean;
    /** Shortcut for align-items: baseline */
    aib?: boolean;
    /** Shortcut for justify-content: center */
    jcc?: boolean;
    /** Shortcut for justify-content: end */
    jce?: boolean;
    /** Shortcut for justify-content: start */
    jcs?: boolean;
};