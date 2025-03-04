import { Position } from "../../types/enums";
import { BoxProps } from "../Box";
import { ActionBarHandler } from "./types";
/**
 * ActionBar renders a list of buttons with tooltips.
 *
 * @example
 * ```tsx
 * const items = [
 *   { label: 'Edit', icon: <EditIcon />, onClick: () => console.log('Edit clicked') },
 *   { label: 'Delete', icon: <DeleteIcon />, onClick: () => console.log('Delete clicked') }
 * ];
 *
 * <ActionBar items={items} />
 * ```
 */
declare const ActionBar: import("react").ForwardRefExoticComponent<BoxProps & {
    selected?: number | string;
    onSwitch?: (tag: string) => void;
    items: import("./types").ActionBarItem[];
    position?: Position;
} & import("react").RefAttributes<ActionBarHandler>>;
export default ActionBar;
