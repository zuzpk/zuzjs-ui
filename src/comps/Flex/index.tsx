"use client"
import { FC } from "react";
import Box from "../Box";
import { FlexProps } from "./types";

const Flex: FC<FlexProps> = ({ 
    cols, 
    gap, 
    aic, 
    jcc, 
    className = "", 
    style, 
    ...props 
}) => {
    
    // Compute utility classes based on props
    const flexClasses = [
        "--flex",
        cols ? "--cols" : "", // Matching your 'cols' class for direction
        aic ? "--aic" : "",
        jcc ? "--jcc" : "",
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