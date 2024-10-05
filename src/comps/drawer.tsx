import { forwardRef, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import With, { animationProps } from "./base";
import { DRAWER_SIDE, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";

export interface DrawerProps {
    as?: string,
    speed?: number,
    from?: DRAWER_SIDE,
    children: string | ReactNode | ReactNode[],
}

export interface DrawerHandler {
    open: () => void,
    close: () => void,
}

const Drawer = forwardRef<DrawerHandler, DrawerProps>((props, ref) => {
    
    const { as, from, speed, children, ...rest } = props;

    const [ visible, setVisible ] = useState(false)
    const divRef = useRef<HTMLDivElement>(null);

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
        open(){
            setVisible(true)
        },
        close(){
            setVisible(false)
        }
    }))

    return <>
        <With className={`zuz-overlay fixed fill`} 
            onClick={(e: MouseEvent) => {
                if ( visible ){
                    setVisible(false)
                }
            }} 
            aria-hidden={!visible} animate={{
                transition: TRANSITIONS.FadeIn,
                when: visible,
            }} />
        <With 
            ref={divRef}
            as={as} 
            className={`zuz-drawer flex cols drawer-${from ? from.toLowerCase() : `left`} fixed`}
            animate={{
                from: { ...style.from, opacity: 0 },
                to: { ...style.to, opacity: 1 },
                when: visible,
                curve: TRANSITION_CURVES.EaseInOut,
                duration: speed || .5,
            }}
            {...rest}>
                {from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? <With className="drawer-handle" /> : null}
                {children}
        </With>
    </>
})

export default Drawer