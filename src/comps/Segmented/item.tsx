import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDelayed } from "../.."
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

    useLayoutEffect(() => {
        if ( hydrated && ref.current ){
            const { width, x } = ref.current.getBoundingClientRect()
            setPos({ x, width })
            if ( selected ){
                onSelect(index!, width, x, meta, true)
            }
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
        className={`--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim()}>
        {icon ? 
            `string` == typeof icon ? <Icon name={icon} as={`--segment-icon`} /> : <Box as={`--segment-icon flex aic jcc`}>{icon}</Box>
            : null} 
        {label && String(label).trim() != `` && <Box className={`--segment-label`}>{label || `Item ${index}`}</Box>}
    </Button>

}

SegmentItem.displayName = `SelectTabItem`

export default SegmentItem