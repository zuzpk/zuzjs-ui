import { KeyCode, useDevice, useShortcuts } from "@zuzjs/hooks";
import { Ref, useEffect, useMemo, useState } from "react";
import { useBase, useFx } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { BoxProps, DRAWER_SIDE, TRANSITION_CURVES } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Cover from "../Cover";
import { layerManager } from "../layer_manager";
import Overlay from "../Overlay";
import ScrollView from "../ScrollView";
import SVGIcons from "../svgicons";
import { DrawerProps } from "./types";

/**
 * Drawer component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Drawer open={true} onClose={() => setOpen(false)}>Drawer content here</Drawer>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Drawer open={true} onClose={() => setOpen(false)} position="right" size="lg" variant="overlay">Navigation menu</Drawer>
 * ```
 * @param open - Whether drawer/sheet is open
 * @param onClose - Callback function triggered when closing
 * @param position - position prop
 * @param size - Component size
 * @param variant - Visual variant or style
 */
const Drawer = ({
    ref,
    ...props
} : DrawerProps & {
    ref?: Ref<HTMLDivElement>
}) => {

    const { 
        id, index, from, speed, children, margin, animation, prerender, 
        inBackground, 
        forceClose, 
        forceLoading,
        closeBtn,
        onClose, 
        ...pops } = props;
    const { drawer: themeDrawer } = useTheme(true)!
    const [ content, setContent ] = useState(children)
    const [ visible, setVisible ] = useState(false)
    const [ render, setRender ] = useState(undefined == prerender ? themeDrawer?.prerender || true : prerender)   
    const [ loading, setLoading ] = useState(false)

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

    useEffect(() => {
        if (forceClose) {
            closeDrawer();
        }
    }, [forceClose]);

    useEffect(() => {
        if ( undefined != forceLoading ) setLoading(forceLoading)
    }, [forceLoading]);

    const side = from || themeDrawer?.from || DRAWER_SIDE.Left;
    const isMobile = useDevice().isMobile;

    const _style = useMemo(() => {

        if ( isMobile ){
            switch (side) {
                case DRAWER_SIDE.Left:
                    // translate by the drawer's OWN width + margin, not the viewport
                    return { from: { x: `calc(-100% - var(--m) - 2px)` }, to: { x: 0 } }
                case DRAWER_SIDE.Right:
                    return { from: { x: `calc(100% + var(--m) + 2px)` }, to: { x: 0 } }
                case DRAWER_SIDE.Top:
                    return { from: { y: `calc(-100% - var(--m) - 2px)` }, to: { y: 0 } }
                case DRAWER_SIDE.Bottom:
                    return { from: { y: `calc(100% + var(--m) + 2px)` }, to: { y: 0 } }
                default:
                    return { from: { x: `calc(-100% - var(--m) - 2px)` }, to: { x: 0 } }
            }
        }

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
    }, [from, themeDrawer?.from, isMobile]);

    const drawerAnimation = useFx({
        from: { ..._style.from, opacity: 0 },
        to: { ..._style.to, opacity: 1 },
        when: visible,
        curve: animation || themeDrawer?.animation || TRANSITION_CURVES.EaseInOut,
        duration: speed || themeDrawer?.speed || .5,
        watch: [`scale`, `filter`]
    })

    const baseZIndex = useMemo(() => 10000 + ((index || 1) * 10), [index]);

    return <>
        <Overlay
            onClick={(e) => {
                if ( visible ){ 
                    closeDrawer()
                }
            }}
            when={visible} 
            style={{ zIndex: baseZIndex }} />

        <Box
            ref={ref}
            aria-hidden={!visible}
            className={`--drawer flex cols ${className}  --${side.toLowerCase()} fixed`}
            style={{
                ...style,
                ...drawerAnimation.style,
                ...{"--m" : `${margin || themeDrawer?.margin || 0}px`},
                zIndex: baseZIndex + 1,
                pointerEvents: inBackground == true ? 'none' : 'auto',
                ...(inBackground == true ? {
                    scale: `0.92`,
                    filter: `blur(2px)`
                } : {})
            }}
            {...rest as BoxProps}>
            {from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? <Box className={`--handle`} /> : null}
            { closeBtn && <Button as={`--close-drawer --close-${closeBtn} --abs --round`} onClick={closeDrawer}>{SVGIcons.close}</Button> }
            <ScrollView as={`rel`}>
                {render ? content : visible ? content : null}
                <Cover when={loading} />
            </ScrollView>
        </Box>
    </>

}

Drawer.displayName = `Zuz.Drawer`

export default Drawer