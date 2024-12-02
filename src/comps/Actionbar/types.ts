import { ReactNode } from "react";
import { BoxProps } from "../Box";
import { Position } from "../../types/enums";

export interface ActionBarHandler {
    show: () => void,
}

/**
 * Represents an item in the ActionBar.
 */
export interface ActionBarItem {
    /** Specific tag for action item */
    tag?: string;
    /** The label of the action item */
    label: string;
    /** The icon to display for the action item */
    icon: ReactNode;
    /** The callback function to execute when the action item is clicked */
    onClick: () => void;
}

/**
 * Props for the ActionBar component.
 */
export type ActionBarProps = BoxProps & {
    /** The index of the initially selected action item */
    selected?: number | string;
    /** Callback function to execute when an action item is clicked */
    onSwitch?: (tag: string) => void;
    /** Array of action items to display in the ActionBar */
    items: ActionBarItem[];
    /** Position of ActionBar */
    position?: Position
};