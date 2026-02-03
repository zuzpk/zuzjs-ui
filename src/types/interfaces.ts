import { Ref } from "react";
import { Props, SkeletonType } from "./shared";
import { SKELETON } from "./enums";
import { ZuzStyleString } from "./css";

export interface ZuzProps {

    /** CSS Styles, such as "w:100" for "width: 100px"; */
    as?: ZuzStyleString | ZuzStyleString[];

    /** Props to remove after processing so it won't appear in DOM */
    propsToRemove?: string[];

    /** Additional class names for styling the component */
    className?: string;

}

export interface BoxProps extends Partial<Props<`div`>> {
    name?: string
    ref?: Ref<HTMLDivElement>
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
    type?: SkeletonType;

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