import { useEffect, useRef, useState } from "react"
import { Segment, SegmentItemProps } from "./types"
import Button from "../Button"
import Box, { BoxProps } from "../Box"
import { ButtonHandler } from "../Button/types"


const SegmentItem = ({ onSelect, meta, selected } : SegmentItemProps) => {

    const ref = useRef<ButtonHandler | null>(null)
    const { index, icon, label } = meta as Segment
    const [ pos, setPos ] = useState({ x: 0, width: 0  })
    // const [ _initial, setInitial ] = useState(true)
    useEffect(() => {
        if ( ref.current ){
            const { width, x } = ref.current.getBoundingClientRect()
            setPos({ x, width })
        }
        // else
        //     setInitial(false)
    }, [ref.current])

    useEffect(() => {
        if ( selected ){
            onSelect(index!, pos.width, pos.x, meta)
        }
    }, [selected])

    return <Button
        onClick={() => onSelect(index!, pos.width, pos.x, meta)}
        ref={ref}
        className={`--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim()}>
        {icon && <Box 
            className={`--segment-icon ${icon instanceof String ? `icon-${icon}` : `flex aic jcc`}`}>{typeof icon !== `string` && icon}</Box>}
        {label && label.trim() != `` && <Box className={`--segment-label`}>{label || `Item ${index}`}</Box>}
    </Button>

}

export default SegmentItem