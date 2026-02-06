import { ComponentPropsWithRef, CSSProperties, JSX, RefObject } from "react"
import { cssShortKey, dynamic, Props, ZuzProps } from "../types"
import { cleanProps } from "../funs"
import { buildClassString, buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css"
import { cssFilterKeys, cssProps, cssTransformKeys, cssWithKeys } from "../builder/stylesheet"
import useFx from "./useFx"

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
        ...rest
    } = props || {}

    const animationConfig = autoTransition ? {
        transition: autoTransition,
        duration: 0.3
    } : fx || {}
    const { style: transitionStyle } = useFx(animationConfig, ref);

    const manifestClasses = buildClassString(as ?? ``)

    return {
        style: {
            ...transitionStyle
            // ...buildWithStyles(_style),
            // ..._transition
        },
        className: [
            className || ``, 
            manifestClasses || ``,
            skeleton?.enabled ? `--skeleton` : ``,
        ].join(` `).trim(),
        rest: {
            ...cleanProps(
                rest as Omit<ZuzProps, keyof ZuzProps>,
                propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]
            )
        } as ComponentPropsWithRef<T>
    }

}

export default useBase