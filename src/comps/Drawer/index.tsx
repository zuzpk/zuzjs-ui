import { FC, ReactNode, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { DrawerHandler, DrawerProps } from "./types"
import { useBase, useFx } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { KeyCode, useDelayed, useShortcuts } from "@zuzjs/hooks";
import { layerManager } from "../layer_manager";
import Overlay from "../Overlay";
import { BoxProps, DRAWER_SIDE, TRANSITION_CURVES, TRANSITIONS } from "../../types";
import Box from "../Box";

const Drawer = ({
    ref,
    ...props
} : DrawerProps & {
    ref?: Ref<HTMLDivElement>
}) => {

    const { id, index, from, speed, children, margin, animation, prerender, onClose, ...pops } = props;
    const { drawer: themeDrawer } = useTheme(true)!
    const [ content, setContent ] = useState(children)
    const [ visible, setVisible ] = useState(false)
    const [ render, setRender ] = useState(undefined == prerender ? themeDrawer?.prerender || true : prerender)   
    
    const closeDrawer = () => {
        setVisible(false)
        onClose?.(id ?? -1)
    }

    const {
        className,
        style,
        rest
    } = useBase(pops)

    const shortcutsConfig = useMemo(() => [
        { 
            keys: [KeyCode.Escape], 
            callback: () => {
                if (layerManager.isTop(closeDrawer)) closeDrawer();
            }
        }
    ], [visible]);

    useShortcuts(shortcutsConfig)

    useEffect(() => {
        setContent(children);
    }, [children]);

    useEffect(() => {
        if ( visible ){
            layerManager.push(closeDrawer)
        }else{
            layerManager.pop(closeDrawer)
        }
        return () => layerManager.pop(closeDrawer)
    }, [visible])

    useEffect(() => {
        setVisible(true)
    }, [])

    const side = from || themeDrawer?.from || DRAWER_SIDE.Left;

    const _style = useMemo(() => {
        switch (side) {
            case DRAWER_SIDE.Left:
                // Use vw for horizontal, vh for vertical
                return { from: { x: `-100vw` }, to: { x: 0 } }
            case DRAWER_SIDE.Right:
                return { from: { x: `100vw` }, to: { x: 0 } }
            case DRAWER_SIDE.Top:
                return { from: { y: `-100vh` }, to: { y: 0 } }
            case DRAWER_SIDE.Bottom:
                return { from: { y: `100vh` }, to: { y: 0 } }
            default:
                return { from: { x: `-100vw` }, to: { x: 0 } }
        }
    }, [from, themeDrawer?.from]);

    const drawerAnimation = useFx({
        from: { ..._style.from, opacity: 0 },
        to: { ..._style.to, opacity: 1 },
        when: visible,
        curve: animation || themeDrawer?.animation || TRANSITION_CURVES.EaseInOut,
        duration: speed || themeDrawer?.speed ||.5,
    })

    return <>
        <Overlay
            onClick={(e) => {
                if ( visible ){ 
                    closeDrawer()
                }
            }}
            when={visible} />

        <Box
            ref={ref}
            aria-hidden={!visible}
            className={`--drawer flex cols ${className}  --${side.toLowerCase()} fixed`}
            style={{
                ...style,
                ...drawerAnimation.style,
                ...{"--m" : `${margin || themeDrawer?.margin || 0}px`}
            }}
            {...rest as BoxProps}>
            {from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? <Box className={`--handle`} /> : null}
            {render ? content : visible ? content : null}
        </Box>
    </>

}

Drawer.displayName = `Zuz.Drawer`

export default Drawer