import { ComponentPropsWithRef, CSSProperties, JSX, RefObject } from "react"
import { dynamic, Props, ZuzProps } from "../types"
import { cleanProps } from "../funs"
import { buildClassString } from "../funs/css"

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
        className,
        propsToRemove,
        ...rest
    } = props || {}

    const _style : dynamic = {}
    const manifestClasses = buildClassString(as ?? ``)

    return {
        style: {
            ..._style
        },
        className: `${className || ``} ${manifestClasses || ``}`.trim(),
        rest: {
            ...cleanProps(
                rest as Omit<ZuzProps, keyof ZuzProps>,
                propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]
            )
        } as ComponentPropsWithRef<T>
    }

}

export default useBase