import { ReactNode } from "react";
import { BoxProps } from "../../types";

export type StackProps = BoxProps & {

    children: ReactNode,

    width?: number | string,

    height?: number | string,    
    
    /**
     * Automatically changes layout direction to horizontal row. 
     * Defaults to vertical column.
     */
    horizontal?: boolean;

    /**
     * Space between stack items. 
     */
    gap?: number | string;

    /**
     * When true, transforms the stack into a Stacked Card Deck.
     */
    deck?: boolean;

    /**
     * Optional: Controls the rotational spread multiplier of the deck fan. Defaults to 4.
     */
    deckOffset?: number;
    deckOffsetX?: number;
    deckOffsetY?: number;
    deckDirection?: "left" | "right",
    deckBlastRadius?: number;
}