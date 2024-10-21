import { forwardRef, useImperativeHandle, useRef } from "react"
import { BaseProps } from "../types/interfaces"
import { dynamicObject } from "../types"
import With from "./base"
import { PROGRESS } from "../types/enums"

export interface ProgressBarProps {
    progress: number,
    type?: PROGRESS
}

export interface ProgressHandler {
    setWidth?: (w : number) => void
}

const ProgressBar = forwardRef<ProgressHandler, ProgressBarProps & BaseProps>((props, ref) => {

    const { as } = props
    const bar = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        setWidth: (progress: number) => {
            bar.current!.style.width = `${progress * 100}%`
        }
    }), [])

    return <With className={`--progress flex rel`} as={as}>
        <With ref={bar} className={`--bar rel`} />
    </With>

})

export default ProgressBar

