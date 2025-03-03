'use client'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { ProgressBarProps, ProgressHandler } from "./types"
import Box, { BoxProps } from "../Box"
import { useBase } from "../../hooks"

const ProgressBar = forwardRef<ProgressHandler, ProgressBarProps>((props, ref) => {

    const { progress, type, ...pops } = props
    const bar = useRef<HTMLDivElement>(null)
    
    useImperativeHandle(ref, () => ({
        setWidth: (p: number) => {
            bar.current!.style.width = `${p * 100}%`
        }
    }), [])

    useEffect(() => {
        if ( progress && bar.current ) {
            bar.current!.style.width = `${progress * 100}%`
        }
    }, [])

    const { className, style, rest } = useBase(pops)

    return <Box
        className={`--progress flex rel ${className}`.trim()}
        style={style}
        {...rest as BoxProps}>
        <Box ref={bar} className={`--bar rel`} />
    </Box>

})

export default ProgressBar