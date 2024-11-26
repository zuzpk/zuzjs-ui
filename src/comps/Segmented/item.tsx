import { useEffect, useRef, useState } from "react"
import { Segment, SegmentItemProps } from "./types"
import Button from "../Button"
import Box, { BoxProps } from "../Box"


const SegmentItem = ({ onSelect, meta, selected } : SegmentItemProps) => {

    const ref = useRef<HTMLButtonElement | null>(null)
    const { index, icon, label } = meta as Segment
    const [ pos, setPos ] = useState({ x: 0, width: 0  })

    useEffect(() => {
        if ( ref.current ){
            const { width, x } = ref.current.getBoundingClientRect()
            setPos({ x, width })
        }
        if ( selected ){
            onSelect(index!, pos.width, pos.x, meta)
        }
    }, [ref.current])

    return <Button
        onClick={() => onSelect(index!, pos.width, pos.x, meta)}
        ref={ref}
        className={`--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim()}>
        {icon && <Box 
            className={`--segment-icon icon-${icon}`}/>}
        <Box className={`--segment-label`}>{label || `Item ${index}`}</Box>
    </Button>

}

export default SegmentItem