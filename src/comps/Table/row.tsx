import { ReactNode, useMemo } from "react"
import Box from "../Box"
import TColumn from "./col"
import type { Column, Row } from "./types"
import { animationProps } from "../../types/interfaces"
import { TRANSITION_CURVES, TRANSITIONS } from "../../types/enums"
import { useDelayed } from "../../hooks"

const TRow = (props: Row) => {

    const { index, schema, data, ids, styles, animate, rowClassName, onContextMenu } = props
    const mounted = useDelayed()
    const _animation = useMemo(() => ({
        transition: TRANSITIONS.SlideInBottom,
        curve: TRANSITION_CURVES.EaseInOut,
        delay: .02 * (index + 1),
    } as animationProps), [])
    
    return <Box 
        onContextMenu={e => onContextMenu ? onContextMenu(e, data!) : null}
        // data-index={index}
        {...( animate ? { animate: { ..._animation, when: mounted } } : {} )}
        as={`--row flex aic ${index == -1 ? `--row-head` : ``} ${rowClassName || ``}`}>
        
        {/* Header */}
        {index == -1 && schema.map((c: Column, i: number) => {
            const { renderWhenHeader, render, value, ...cc } = c 
            return <TColumn 
                key={`--col-${c.id}`} idx={-1} 
                value={renderWhenHeader && render ? render!(index == -1 ? c : data!, index) : value as string} 
                {...cc} 
                style={styles[c.id]} />
        })}

        {/* Data */}
        {index > -1 && ids && data && schema.map((c: Column, i: number) => {
            return ids.includes(String(c.id)) ? <TColumn 
                key={`--${String(c.id)}-val-${i}`} 
                idx={i} 
                id={String(c.id)}
                style={styles[String(c.id)]}
                value={c.render ? c.render!(data, index) : data[String(c.id)]} 
            /> : null
        })}
    </Box>

}

export default TRow