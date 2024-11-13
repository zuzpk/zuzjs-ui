"use client"
import React, { ComponentProps, createElement, ElementType, forwardRef, HTMLAttributes, Ref } from "react"
import { useBase } from "../../hooks";
import { Props } from "../../types";

export interface BoxProps extends Partial<Props<`div`>> {
    name?: string
}

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    const { style, ...pops } = props
    const { 
        style : _style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    return <div
        ref={ref}
        className={className}
        style={{
            ..._style,
            ...(style || {})
        }}
        {...rest}
    />
    
})

export default Box