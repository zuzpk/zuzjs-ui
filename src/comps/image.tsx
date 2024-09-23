import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import React from "react";

interface ImageProps {
    width: string | number;
    height: string | number;
    as?: string;
    animate?: animationProps;
    src: string;
    alt: string;
    crossover?: boolean;
}

const Image = forwardRef<HTMLDivElement, ImageProps & ComponentPropsWithoutRef<`img`>>((props, ref ) => {
    
    const { as, width, height, ...rest } = props;

    return <With 
        tag={`img`}
        as={as} 
        {...rest} 
        ref={ref} />

});

export default Image