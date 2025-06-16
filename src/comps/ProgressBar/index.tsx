"use client"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { useBase } from "../../hooks"
import Box, { BoxProps } from "../Box"
import { ProgressBarProps, ProgressHandler } from "./types"

const ProgressBar = forwardRef<ProgressHandler, ProgressBarProps>((props, ref) => {

    const { progress, type, animated, ...pops } = props
    const bar = useRef<HTMLDivElement>(null)
    
    useImperativeHandle(ref, () => ({
        setProgress: (p: number) => {
            bar.current!.style.width = `${p * 100}%`
        }
    }), [])

    useEffect(() => {
        console.log(`progressChanged`, progress)
        if ( progress && bar.current ) {
            if ( animated ){
                setTimeout(() => bar.current!.style.width = `${progress * 100}%`, 500)
            }
            else bar.current!.style.width = `${progress * 100}%`
        }
    }, [progress, bar.current])

    const { className, style, rest } = useBase(pops)

    return <Box
        className={`--progress ${animated ? `--animated` : ``} flex rel ${className}`.trim()}
        style={style}
        {...rest as BoxProps}>
        <Box ref={bar} className={`--bar rel`} />
    </Box>

})

ProgressBar.displayName = `Zuz.ProgressBar`

export default ProgressBar