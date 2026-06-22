import React, { FC, MouseEvent as ReactMouseEvent, ReactNode, RefObject } from "react";
import { BoxProps, ORIGIN, ValueOf } from "../../types";

/**
 * Represents a single menu item in the context menu.
 */
    
export type ContextItem = ContextItemConfig | ReactNode | FC;
export type ContextMenuArrowSide = "top" | "left" | "right" | "bottom";
export type ContextMenuArrowAlign = "left" | "center" | "right" | "top" | "bottom";
export interface ContextItemConfig {
    /** The display text for the menu item */
    label: string | ReactNode;
    /** Optional color for the label text */
    labelColor?: string;
    /** Optional icon identifier or class name */
    icon?: string | ReactNode;
    /** Optional color for the icon */
    iconColor?: string;
    /** Optional CSS class to apply to the menu item */
    className?: string;
    /** Whether the menu item is enabled and selectable */
    enabled?: boolean;
    /** Callback function invoked when the menu item is selected */
    onSelect?: (item: ContextItemConfig) => void;
    /** Optional nested submenu items */
    submenu?: ContextItem[];
    /** Action */
    action?: React.ReactNode;
}

/**
 * Props for the ContextMenu component.
 * Extends the BoxProps interface with context menu specific properties.
 */
export type ContextMenuProps = BoxProps & {
    /** Unique identifier for the context menu instance */
    id?: number,
    /** The mouse or touch event that triggered the context menu */
    event?: ReactMouseEvent<Element, MouseEvent> | TouchEvent,
    /** Reference to the parent HTML element */
    parent?: RefObject<HTMLElement | null>,
    /** The origin point for positioning the context menu */
    origin?: ValueOf<typeof ORIGIN>
    /** Array of menu items to display */
    items?: ContextItem[],
    /** Horizontal offset in pixels from the trigger point */
    offsetX?: number,
    /** Vertical offset in pixels from the trigger point */
    offsetY?: number,
    /** Optional header component or ReactNode to display at the top */
    header?: ReactNode | FC,
    /** Optional footer component or ReactNode to display at the bottom */
    footer?: ReactNode | FC,
    /** Conditional flag to control whether the context menu is displayed */
    when?: boolean,
    /** Arrow */
    arrow?: boolean,
    /** Force arrow side independent of origin/auto placement */
    arrowSide?: ContextMenuArrowSide,
    /** Force arrow alignment on the selected side */
    arrowAlign?: ContextMenuArrowAlign,
    /** Width of the context menu */
    width?: number | string,
    /** Callback invoked when the context menu is closed with its id */
    onClose?: (id: number) => void
}

/**
 * Props for individual MenuItem components.
 * Extends ContextItem with additional rendering properties.
 */
export type MenuItemProps = ContextItemConfig & {
    /** Index position of the menu item in the menu list */
    index: number;
    /** Whether this item opens a submenu */
    hasSubmenu?: boolean;
    /** Mouse enter handler for submenu anchoring */
    onHover?: () => void;
    /** Attach ref to the clickable item root */
    itemRef?: (node: HTMLButtonElement | null) => void;

}

/**
 * Handler interface for imperative control of the ContextMenu component.
 * Used with useRef and forwardRef for programmatic visibility control.
 */
export interface ContextMenuHandler {
    /**
     * Display the context menu at the position of the provided event.
     * @param e - The mouse or touch event that triggered the menu
     * @param items - Optional array of menu items to display
     */
    show: (e: ReactMouseEvent<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    /**
     * Hide/close the context menu.
     * @param e - The mouse or touch event that triggered the close action
     */
    hide: (e: ReactMouseEvent | TouchEvent) => void;
}