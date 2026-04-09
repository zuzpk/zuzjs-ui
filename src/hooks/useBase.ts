import { ComponentPropsWithRef, CSSProperties, JSX, RefObject } from "react"
import { cleanProps } from "../funs"
import { buildClassString } from "../funs/css"
import { dynamic, Props, ZuzProps } from "../types"
import useFx from "./useFx"

let useDrag: any = null;
type CSSVarStyle = CSSProperties & Record<`--${string}`, string | number>;

const toCssSize = (value?: string | number): string | undefined => {
    if (value === undefined || value === null) return undefined;
    return typeof value === "number" ? `${value}px` : value;
}

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
        busy = false,
        stripes,
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

    const zuzClasses = [
        className,
        busy === true ? `--is-busy` : ``,
        stripes ? `--has-stripes --stripes-${stripes}` : ``

    ].filter(Boolean).join(` `)

    const animationConfig = autoTransition ? {
        transition: autoTransition,
        duration: 0.3
    } : fx || {}
    const { style: transitionStyle } = useFx(animationConfig, ref);

    const skeletonStyle: CSSVarStyle = {};
    if (skeleton?.enabled) {
        const size = toCssSize(skeleton.size);
        const width = toCssSize(skeleton.width);
        const height = toCssSize(skeleton.height);
        const defaultSize = toCssSize(skeleton.defaultSize);
        const radius = toCssSize(skeleton.radius);

        if (size) {
            skeletonStyle["--skeleton-width"] = size;
            skeletonStyle["--skeleton-height"] = size;
        } else {
            if (width) skeletonStyle["--skeleton-width"] = width;
            if (height) skeletonStyle["--skeleton-height"] = height;
            if (defaultSize) skeletonStyle["--skeleton-default-size"] = defaultSize;
        }

        if (radius) {
            skeletonStyle["--skeleton-radius"] = radius;
        }
    }

    const manifestClasses = buildClassString(as ?? ``)

    return {
        style: {
            ...skeletonStyle,
            ...incomingStyle,
            ...transitionStyle,
            ...dragStyle
        },
        className: [
            zuzClasses, 
            manifestClasses || ``,
            skeleton?.enabled ? `--skeleton` : ``,
            skeleton?.enabled && skeleton?.type === `CIRCLE` ? `--skeleton-circle` : ``,
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