import { ComponentPropsWithRef, CSSProperties, JSX, RefObject } from "react"
import { cleanProps } from "../funs"
import { buildClassString } from "../funs/css"
import { dynamic, Props, ZuzProps } from "../types"
import useFx from "./useFx"

let useDrag: any = null;

const useBase = <T extends keyof JSX.IntrinsicElements>(
    props: Props<T>, 
    ref?: RefObject<HTMLElement>
) : {
    style: CSSProperties,
    className: string,
    rest: ComponentPropsWithRef<T>
} => {

    const {
        as,
        fx,
        transition: autoTransition,
        skeleton,
        className,
        propsToRemove,
        draggable,
        dragOptions,
        style: incomingStyle,
        ...rest
    } = props || {}

    const hasWindow = typeof window !== "undefined";
    let dragProps : dynamic = {};
    let dragStyle : dynamic = {};
    if ( draggable && hasWindow ) {
        if (!useDrag) {
            import("@zuzjs/hooks")
                .then(module => {
                    useDrag = module.useDrag;
                })
                .catch(err => {
                    console.error("Error loading useDrag:", err);
                });
            if ( useDrag ) {
                const drag = useDrag(dragOptions);
                dragProps = {
                    onMouseDown: drag.onMouseDown,
                }
                dragStyle = {
                    transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
                }
            }
        }
    }

    const animationConfig = autoTransition ? {
        transition: autoTransition,
        duration: 0.3
    } : fx || {}
    const { style: transitionStyle } = useFx(animationConfig, ref);

    const manifestClasses = buildClassString(as ?? ``)

    return {
        style: {
            ...incomingStyle,
            ...transitionStyle,
            ...dragStyle
        },
        className: [
            className || ``, 
            manifestClasses || ``,
            skeleton?.enabled ? `--skeleton` : ``,
            draggable ? `--draggable` : ``,
        ].join(` `).trim(),
        rest: {
            ...dragProps,
            ...cleanProps(
                rest as Omit<ZuzProps, keyof ZuzProps>,
                propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]
            )
        } as ComponentPropsWithRef<T>
    }

}

export default useBase