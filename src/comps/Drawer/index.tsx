"use client"
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useShortcuts } from "../../hooks";
import { DRAWER_SIDE, KeyCode, TRANSITION_CURVES } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import Overlay from "../Overlay";
import { DrawerHandler, DrawerProps } from "./types";

const Drawer = forwardRef<DrawerHandler, DrawerProps>((props, ref) => {
    
    const { as, from, speed, children, prerender, onClose, ...pops } = props;

    const [ render, setRender ] = useState(undefined == prerender ? true : prerender)   
    const [ visible, setVisible ] = useState(false)
    const divRef = useRef<HTMLDivElement>(null);
    const [ content, setContent ] = useState(children)

    useShortcuts([
        { keys: [KeyCode.Escape], callback: () => {
            if(visible){
                onClose?.();
                setVisible(false);
            }
        }}
    ])

    useEffect(() => {
        setContent(children);
    }, [children]);

    const style = useMemo(() => {
        switch (from){
            case DRAWER_SIDE.Left:
                return { from: { x: `-100vh` }, to: { x: 0 } }
            case DRAWER_SIDE.Right:
                return { from: { x: `100vh` }, to: { x: 0 } }
            case DRAWER_SIDE.Top:
                return { from: { y: `-100vh` }, to: { y: 0 } }
            case DRAWER_SIDE.Bottom:
                return { from: { y: `100vh` }, to: { y: 0 } }
            default:
                return { from: { x: `-100vh` }, to: { x: 0 } }
        }
    }, [])

    useImperativeHandle(ref, () => ({
        open(child?: string | ReactNode | ReactNode[]){
            if ( child ) setContent(child)
            setVisible(true)            
        },
        close(){
            onClose?.()
            setVisible(false)
        }
    }))

    return <>

        <Overlay
            onClick={(e) => {
                if ( visible ){ 
                    onClose?.()
                    setVisible(false) 
                }
            }}
            when={visible} />
        
        <Box
            ref={divRef}
            className={`--drawer flex cols --${from ? from.toLowerCase() : `left`} fixed`}
            fx={{
                from: { ...style.from, opacity: 0 },
                to: { ...style.to, opacity: 1 },
                when: visible,
                curve: TRANSITION_CURVES.EaseInOut,
                duration: speed || .5,
            }}
            {...pops as BoxProps}>
            {from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? <Box className={`--handle`} /> : null}
            {render ? content : visible ? content : null}
        </Box>

    </>
})

Drawer.displayName = `Drawer`

export default Drawer