import { BoxProps } from "../Box";
export type OverlayProps = BoxProps & {
    when?: boolean;
};
export declare const Overlay: import("react").ForwardRefExoticComponent<BoxProps & {
    when?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Overlay;
