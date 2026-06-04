"use client"
import { FC } from "react";
import Box from "../Box";
import { FlexProps } from "./types";

/**
 * Flex component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Flex gap="md" align="center">Item 1 | Item 2 | Item 3</Flex>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Flex gap="lg" align="center" justify="space-between" direction="row" wrap={true}>Flexible layout</Flex>
 * ```
 * @param gap - Spacing between items
 * @param align - Alignment direction
 * @param justify - Justification direction
 * @param direction - direction prop
 * @param wrap - wrap prop
 */
const Flex: FC<FlexProps> = ({ 
    cols, 
    gap, 
    ass,
    asc,
    ase,
    ais,
    aic,
    aie,
    aib,
    jcs, 
    jcc,
    jce, 
    wrap,
    className = "", 
    style, 
    ...props 
}) => {
    
    // Compute utility classes based on props
    const flexClasses = [
        "--flex",
        cols ? "--cols" : "", // Matching your 'cols' class for direction
        ass ? "--ass" : "",
        asc ? "--asc" : "",
        ase ? "--ase" : "",
        ais ? "--ais" : "",
        aic ? "--aic" : "",
        aie ? "--aie" : "",
        aib ? "--aib" : "",
        jcs ? "--jcs" : "",
        jcc ? "--jcc" : "",
        jce ? "--jce" : "",
        wrap ? "--wrap" : "",
        className
    ].filter(Boolean).join(" ");

    const flexStyle = {
        ...style,
        gap: typeof gap === "number" ? `${gap}px` : gap
    };

    return (
        <Box 
            {...props} 
            className={flexClasses} 
            style={flexStyle} 
        />
    );
}

Flex.displayName = `Zuz.FlexBox`

export default Flex;