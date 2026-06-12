import { useDrag, useDrop } from "@zuzjs/hooks"
import { ComponentPropsWithRef, CSSProperties, JSX, Ref, RefObject, useContext, useLayoutEffect } from "react"
import { TimelineContext } from "../comps/Timeline"
import { cleanProps } from "../funs"
import { buildClassString } from "../funs/css"
import { dynamic, Props, ZuzProps } from "../types"
import useFx from "./useFx"

type CSSVarStyle = CSSProperties & Record<`--${string}`, string | number>;

const setRef = <T,>(target: Ref<T> | undefined, value: T) => {
    if (!target) return;
    if (typeof target === "function") {
        target(value);
        return;
    }
    (target as { current: T }).current = value;
}

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
        droppable,
        dropOptions,
        timeline,
        timelineRoot,
        textSize,
        style: incomingStyle,
        ...rest
    } = props || {}

    const timelineLayer = timeline && typeof timeline !== "string" ? timeline : undefined;
    const timelineLayerId = typeof timeline === "string" ? timeline : timeline?.id;

    // Register/unregister this element as a timeline layer in the nearest provider
    const timelineCtx = useContext(TimelineContext);
    const registerLayer = timelineCtx?.registerLayer;
    const unregisterLayer = timelineCtx?.unregisterLayer;
    const timelineSignature = timelineLayer ? JSON.stringify(timelineLayer) : ``;

    useLayoutEffect(() => {
        if (!timelineLayer || !registerLayer || !unregisterLayer) return;
        registerLayer(timelineLayer);
        return () => unregisterLayer(timelineLayer.id);
    }, [registerLayer, timelineLayer, timelineSignature, unregisterLayer]);

    // Resolved timeline effects for this layer (empty when no provider or no id match)
    const timelineStyle: CSSProperties = (timelineLayerId && timelineCtx?.effects?.[timelineLayerId] && !timelineCtx?.waapi?.enabled)
        ? timelineCtx.effects[timelineLayerId] as CSSProperties
        : {};

    const [dragCollected, dragRef] = useDrag(() => {
        if (!draggable || !dragOptions) {
            return {
                channel: "__zuz_ui_drag_disabled__",
                when: false,
                observe: () => ({})
            };
        }

        return dragOptions();
    }, [draggable, dragOptions]);

    const [dropCollected, dropRef] = useDrop(() => {
        if (!droppable || !dropOptions) {
            return {
                accepts: "__zuz_ui_drop_disabled__",
                canReceive: () => false,
                observe: () => ({})
            };
        }

        return dropOptions();
    }, [droppable, dropOptions]);

    const dragStyle = (dragCollected as dynamic)?.style || {};
    const dropStyle = (dropCollected as dynamic)?.style || {};
    const dragClassName = (dragCollected as dynamic)?.className || "";
    const dropClassName = (dropCollected as dynamic)?.className || "";

    const { style: _dragStyle, className: _dragClassName, ...dragRest } = (dragCollected as dynamic) || {};
    const { style: _dropStyle, className: _dropClassName, ...dropRest } = (dropCollected as dynamic) || {};

    const incomingRef = (rest as ComponentPropsWithRef<T>).ref as Ref<HTMLElement> | undefined;
    const shouldInjectComposedRef = Boolean(draggable || droppable || incomingRef || timelineRoot);

    const composedRef: Ref<HTMLElement> = (node) => {
        setRef(incomingRef, node as HTMLElement);
        setRef(ref as Ref<HTMLElement> | undefined, node as HTMLElement);
        if (timelineRoot && timelineCtx?.containerRef) {
            timelineCtx.containerRef.current = node as HTMLDivElement | null;
        }
        if (draggable) dragRef(node as HTMLElement | null);
        if (droppable) dropRef(node as HTMLElement | null);
    };

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

    const customFontSize = textSize ? { "--text-size-custom": typeof textSize === "number" ? `${textSize}px` : textSize } as React.CSSProperties : {}

    return {
        style: {
            ...skeletonStyle,
            ...incomingStyle,
            ...transitionStyle,
            ...dragStyle,
            ...dropStyle,
            ...timelineStyle,
            ...customFontSize,
        },
        className: [
            zuzClasses, 
            manifestClasses || ``,
            skeleton?.enabled ? `--skeleton` : ``,
            skeleton?.enabled && skeleton?.type === `CIRCLE` ? `--skeleton-circle` : ``,
            draggable ? `--draggable` : ``,
            droppable ? `--droppable` : ``,
            dragClassName,
            dropClassName,
        ].join(` `).trim(),
        rest: {
            ...dragRest,
            ...dropRest,
            ...cleanProps(
                rest as Omit<ZuzProps, keyof ZuzProps>,
                propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]
            ),
            ...(timelineLayerId ? { "data-zuz-timeline-layer": timelineLayerId } : {}),
            ...(shouldInjectComposedRef ? { ref: composedRef } : {}),
        } as ComponentPropsWithRef<T>
    }

}

export default useBase