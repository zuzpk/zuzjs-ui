import { dynamicObject } from ".";
import { SKELETON, TRANSITION_CURVES, TRANSITIONS } from "./enums";

/**
 * `animationProps` defines the properties to control animation effects
 * applied to elements. Supports transitions with timing configurations.
 */
export interface animationProps {
    /**
     * Specifies the type of transition to apply, based on predefined 
     * {@link TRANSITIONS}
     */
    transition?: TRANSITIONS;

    /** This will be removed / added to default calculations for x, y */
    offset?: number,

    /** Starting style properties for the animation */
    from?: dynamicObject;

    /** Target style properties after the animation completes */
    to?: dynamicObject;

    /** Condition that determines when the animation should trigger */
    when?: boolean;

    /** Duration of the animation in milliseconds */
    duration?: number;

    /** Delay before the animation starts, in milliseconds */
    delay?: number;

    /** Easing curve applied to the animation, as a string or {@link TRANSITION_CURVES} */
    curve?: string | TRANSITION_CURVES;
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
    type?: SKELETON;

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