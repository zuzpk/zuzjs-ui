import { Fragment, useEffect, useMemo, useRef } from "react"
import { dynamicObject } from "../.."
import { useDelayed } from "../../hooks"
import { CHECKBOX, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums"
import { animationProps } from "../../types/interfaces"
import Box from "../Box"
import CheckBox from "../CheckBox"
import { CheckboxHandler } from "../CheckBox/types"
import TColumn from "./col"
import type { Column, Row } from "./types"

const TRow = <T, >(props: Row<T>) => {

    const { 
        index, pubsub, schema, data, ids, styles, animate, sortBy, selectable, tableRef, rowClassName, 
        onSort, onSelect, onContextMenu } = props
    const mounted = useDelayed()
    const _animation = useMemo(() => ({
        transition: TRANSITIONS.SlideInBottom,
        curve: TRANSITION_CURVES.EaseInOut,
        delay: .02 * (index + 1),
    } as animationProps), [])
    const checkbox = useRef<CheckboxHandler>(null)
    
    const handleSelector = (chk: boolean, id: string | number | readonly string[]) => {
        if ( index == -1 ){
            pubsub.emit(`ALL_ROWS_${chk ? `CHECKED` : `UNCHECKED`}`, chk)
        }
        else {
            if ( onSelect ) onSelect(data!, chk)
            pubsub.emit(`ROW_${chk ? `CHECKED` : `UNCHECKED`}`, chk, id)
        }
    }

    const Selector = (idx: number, id: string, value: string) => <TColumn 
        idx={idx} 
        id={id} 
        as={`--selector`}
        pubsub={pubsub}
        value={<CheckBox 
            value={value} 
            ref={checkbox} 
            // checked={checked || false} 
            onSwitch={handleSelector} 
            type={CHECKBOX.Default} />}  />

    useEffect(() => {

        const onRowChecked = (mod: boolean, id: string) => {
            checkbox.current?.setChecked(mod, false)
        }
        const onRowUnchecked = (mod: boolean, id: string) => {
            let anyChecked = false
            if ( tableRef?.current ) {
                // tableRef.current.querySelectorAll(`.--selector input[type=checkbox]`).forEach((e) => {
                tableRef.current.querySelectorAll(`.--row`).forEach((e) => {
                    const _row = e as HTMLDivElement
                    if ( !_row.classList.contains(`--row-head`) ){
                        const _checkbox = _row.querySelector(`.--selector input[type=checkbox]`) as HTMLInputElement
                        if ( _checkbox && _checkbox.checked && !anyChecked )
                            anyChecked = _checkbox.checked
                    }
                }) 
            }
            checkbox.current!.setChecked(anyChecked, false)
        }
        const onAllRowsChecked = (mod: boolean) => {
            checkbox.current?.setChecked(mod, false)
            if ( onSelect ) onSelect(data!, mod)
        }

        const onAllRowsUnchecked = (mod: boolean) => {
            checkbox.current?.setChecked(mod, false)
            if ( onSelect ) onSelect(data!, mod)
        }
        

        if ( index == -1 ){
            pubsub.on(`ROW_CHECKED`, onRowChecked)
            pubsub.on(`ROW_UNCHECKED`, onRowUnchecked)
            return () => {
                pubsub.off(`ROW_CHECKED`, onRowChecked)
                pubsub.off(`ROW_UNCHECKED`, onRowUnchecked)
            }
        }else{
            pubsub.on(`ALL_ROWS_CHECKED`, onAllRowsChecked)
            pubsub.on(`ALL_ROWS_UNCHECKED`, onAllRowsUnchecked)
            return () => {
                pubsub.off(`ALL_ROWS_CHECKED`, onAllRowsChecked)
                pubsub.off(`ALL_ROWS_UNCHECKED`, onAllRowsUnchecked)
            }
        }

    }, [])

    return <Box 
        onContextMenu={e => onContextMenu ? onContextMenu(e, data!) : null}
        data-index={index}
        {...( animate ? { animate: { ..._animation, when: mounted } } : {} )}
        as={`--row flex aic ${index == -1 ? `--row-head` : ``} ${rowClassName || ``}`}>
        
        {/* Header */}
        {index == -1 && schema.map((c: Column<T>, i: number) => {
            const { renderWhenHeader, render, value, ...cc } = c 
            return <Fragment key={`--col-${c.id}`}  >
                {selectable && i == 0 && Selector(-1, `--selector-${c.id}`, `all`)}
                <TColumn 
                    idx={-1}
                    onSort={onSort}
                    sortBy={sortBy}
                    // value={renderWhenHeader && render ? render!(index == -1 ? c as dynamicObject : data as T, index) : value as string} 
                    value={value as string} 
                    {...cc} 
                    pubsub={pubsub}
                    style={styles[c.id]} />
            </Fragment>
        })}        

        {/* Data */}
        {index > -1 && ids && data && schema.map((c: Column<T>, i: number) => {
            return <Fragment key={`--${String(c.id)}-val-${i}`}>
                {selectable && i == 0 && Selector(i, `--selector-${c.id}`, c.id.toString())}
                {ids.includes(String(c.id)) ? <TColumn 
                    pubsub={pubsub}
                    idx={i} 
                    id={String(c.id)}
                    style={styles[String(c.id)]}
                    value={c.render ? c.render!(data, index) : (data as dynamicObject)[ String(c.id).includes(`.`) ? String(c.id).split(`.`).reverse()[0] : c.id ]} 
                /> : null}
            </ Fragment>
        })}
    </Box>

}

export default TRow