import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDelayed } from "../../hooks"
import Box from "../Box"
import Button from "../Button"
import { ButtonHandler } from "../Button/types"
import Icon from "../Icon"
import { Segment, SegmentItemProps } from "./types"


const SegmentItem = ({ onSelect, meta, selected } : SegmentItemProps) => {

    const ref = useRef<ButtonHandler | null>(null)
    const { index, icon, label } = meta as Segment
    const [ pos, setPos ] = useState({ x: 0, width: 0  })
    const hydrated = useDelayed()
    // const observer = useResizeObserver(ref)

    useLayoutEffect(() => {
        if ( hydrated && ref.current ){
            const { width, x } =  ref.current.getBoundingClientRect()
            // const { width, left } =  observer
            // console.log(pos, { x: left, width })
            setPos({ x, width })
            if ( selected ){
                onSelect(index!, width, x, meta, true)
            }
            // else if ( pos.x != left || pos.width != width ){
            //     // console.log(`re-triggered`)
            //     setPos({ x: left, width })
            //     onSelect(-2, width, left, meta, false)
            // }
            // console.log(`hydrated`, index, width, x, observer)
        }
    }, [hydrated, ref.current])

    useEffect(() => {
        if ( selected ){
            onSelect(index!, pos.width, pos.x, meta, false)
        }
    }, [selected])

    return <Button
        onClick={() => onSelect(index!, pos.width, pos.x, meta, false)}
        ref={ref}
        className={`--segment-item flex aic rel ${selected ? `--segment-active` : ``}`.trim()}>
        {icon ? 
            `string` == typeof icon ? <Icon name={icon} as={`--segment-icon`} /> : <Box as={`--segment-icon flex aic jcc`}>{icon}</Box>
            : null} 
        {label && String(label).trim() != `` && <Box className={`--segment-label`}>{label || `Item ${index}`}</Box>}
    </Button>

}

SegmentItem.displayName = `SelectTabItem`

export default SegmentItem