import { TimelineLayer, UseDragSpecFactory, UseDropSpecFactory } from "@zuzjs/hooks";
import { Ref } from "react";
import { ZuzStyleString } from "./css";
import { SKELETON, TRANSITION_CURVES, TRANSITIONS } from "./enums";
import { dynamic, Props, ValueOf, WithFormValidation } from "./shared";

export type ZuzTimelineProp = TimelineLayer | string;

export interface ZuzProps {

    /** CSS Styles, such as "w:100" for "width: 100px"; */
    as?: ZuzStyleString | ZuzStyleString[];

    /** Props to remove after processing so it won't appear in DOM */
    propsToRemove?: string[];

    /** Additional class names for styling the component */
    className?: string;

    /** Skeleton placeholder configuration using {@link Skeleton} */
    skeleton?: Skeleton;

    /** Animation configuration using {@link animationProps} */
    fx?: animationProps;

    transition?: ValueOf<typeof TRANSITIONS>,

    /** Makes Component Draggable */
    draggable?: boolean;

    dragOptions?: UseDragSpecFactory<any, Record<string, unknown>>;

    /** Makes Component Droppable */
    droppable?: boolean;

    dropOptions?: UseDropSpecFactory<any, Record<string, unknown>>;

    busy?: boolean;

    stripes?: `background` | `overlay`;

    /**
     * Timeline binding for this element.
     *
     * Pass a full layer object to register a new layer:
     * ```tsx
     * <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>…</Box>
     * ```
     *
     * Pass a string id to reuse effects from an already-registered layer:
     * ```tsx
     * <Text timeline="hero">Repeated animated text</Text>
     * ```
     */
    timeline?: ZuzTimelineProp;

    /**
     * Marks this element as the timeline measurement root for the nearest `TimelineProvider`.
     * Use this when your app scrolls inside an inner container (e.g. custom `ScrollView`).
     */
    timelineRoot?: boolean;

}

export interface BoxProps extends Partial<Props<`div`>> {
    name?: string;
    ref?: Ref<HTMLDivElement>;
    cols?: boolean;
    with?: WithFormValidation,
}

export interface parallaxEffectProps {
    lerpFactor?: number,
    x?: number,
    y?: number
    multiplier?: number,
    xMultiplier?: number,
    yMultiplier?: number
}

/**
 * `animationProps` defines the properties to control animation effects
 * applied to elements. Supports transitions with timing configurations.
 */
export interface animationProps {
    /**
     * Specifies the type of transition to apply, based on predefined 
     * {@link Transitions}
     */
    transition?: ValueOf<typeof TRANSITIONS>;

    /** This will be removed / added to default calculations for x, y */
    offset?: number,

    /** Starting style properties for the animation */
    from?: dynamic;

    /** Target style properties after the animation completes */
    to?: dynamic;

    /** Target style properties for exit animation */
    exit?: dynamic;

    /** Condition that determines when the animation should trigger */
    when?: boolean;

    /** Duration of the animation in milliseconds */
    duration?: number;

    /** Delay before the animation starts, in milliseconds */
    delay?: number;

    /** Easing curve applied to the animation, as a string or {@link TransitionCurves} */
    curve?: string | ValueOf<typeof TRANSITION_CURVES>;

    scroll?: parallaxEffectProps,

    mouse?: parallaxEffectProps,

    /** Clear fx on animation end */
    clearAtEnd?: boolean
}

/**
 * `Skeleton` defines properties for a skeleton loader, used to indicate
 * loading states with placeholders.
 */
export interface Skeleton {
    /**
     * Determines if the skeleton is enabled or disabled.
     * @example
     * enabled: true
     */
    enabled: boolean;

    /** Skeleton type, based on predefined {@link SKELETON} options 
     * @example
     * type: SKELETON.CIRCLE
    */
    type?: ValueOf<typeof SKELETON>;

    /** General size of the skeleton, or can specify width/height separately 
     * @example
     * size: 100 | 100px | 100%
    */
    size?: number | string;
    
    /** Default size of the skeleton if `size` is not specified
     * @default 100%
     * @example
     * defaultSize: 100 | 100px | 100%
    */
    defaultSize?: number | string;

    /** Width of the skeleton placeholder 
     * @example
     * width: 100 | 100px | 100%
    */
    width?: number | string;

    /** Height of the skeleton placeholder 
     * @example
     * height: 100 | 100px | 100%
    */
    height?: number | string;

    /** Border radius for the skeleton, allowing rounded corners */
    radius?: number | string;
}

export interface LayerHandler {
    inBackground?: boolean,
    forceClose?: boolean,
    forceLoading?: boolean,
    /** Soft-close request token: routes through the component's tryClose (respects dirty guard). */
    requestClose?: number,
}

export interface DialogController {
    id: number;
    setLoading: (mod: boolean) => void,
    setDirty: (dirty: boolean) => void,
    hide: () => void
}
export interface DrawerController {
    id: number;
    setLoading: (mod: boolean) => void,
    setDirty: (dirty: boolean) => void,
    close: () => void
}