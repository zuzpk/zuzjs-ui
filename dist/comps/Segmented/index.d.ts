import { Segment } from "./types";
import { BoxProps } from "../Box";
import { Size } from "../../types/enums";
/**
 * `SelectTabs` component is a segmented control that allows switching between segments.
 *
 * @component
 * @param {SegmentProps} props - Props for the segmented control component.
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the root div element.
 * @returns {JSX.Element} The rendered segmented control.
 *
 * @example
 * // Usage example
 * const segments = [
 *   { index: 0, label: "Home", icon: "home_icon" },
 *   { index: 1, label: "Profile", icon: "profile_icon" },
 *   { index: 2, label: "Settings", icon: "settings_icon" }
 * ];
 *
 * <SelectTabs selected={1} items={segments} />
 */
declare const Segmented: import("react").ForwardRefExoticComponent<BoxProps & {
    size?: Size;
    selected?: number;
    onSwitch?: (segment: Segment) => void;
    items: Segment[];
} & import("react").RefAttributes<HTMLDivElement>>;
export default Segmented;
