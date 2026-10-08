import { Ref } from 'react';
import { forwardRef, useMemo, useRef } from 'react';
import { RefObject } from 'react';
import { ScrollPhysicsOptions } from '@zuzjs/hooks';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import { useScrollPhysics } from '@zuzjs/hooks';
import { useScrollView } from '../ScrollView/context';

export type ImageProps = Props<`img`> & {
    /** Scroll physics configuration for applying transform effects based on scroll position */
    scrollPhysics?: ScrollPhysicsOptions;
    /** Reference to a custom scroll container (e.g., ScrollView) */
    scrollContainer?: Ref<HTMLElement>;
}

/**
 * Image component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Image src="https://example.com/image.jpg" alt="Description" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Image src="https://example.com/image.jpg" alt="Product" width="300px" height="auto" objectFit="cover" />
 * ```
 * 
 * @example
 * // With scroll physics for parallax effect
 * ```tsx
 * <Image 
 *   src="https://example.com/image.jpg" 
 *   alt="Parallax" 
 *   scrollPhysics={{ y: 1, yMultiplier: 0.3 }}
 * />
 * ```
 * @param src - Source URL
 * @param alt - Alt text
 * @param width - width prop
 * @param height - height prop
 * @param objectFit - objectFit prop
 * @param scrollPhysics - Scroll physics configuration
 * @param scrollContainer - Custom scroll container reference
 */
const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {

    const innerRef = useRef<HTMLImageElement>(null)
    const targetRef = useMemo(() => ref && typeof ref !== "function" && ref.current ? ref : innerRef, [ref])
    
    const { scrollPhysics, scrollContainer, ...restProps } = props
    
    // Use provided scrollContainer, or get from ScrollView context
    const scrollViewContainer = useScrollView()
    const effectiveScrollContainer = scrollContainer || scrollViewContainer

    const {
        style,
        className,
        rest
    } = useBase<"img">(restProps, targetRef as any)
    
    // Apply scroll physics
    useScrollPhysics(targetRef as RefObject<HTMLElement>, scrollPhysics, effectiveScrollContainer as RefObject<HTMLElement>)
    
    if ( !rest.src || rest.src == `` ) return null

    return <img 
        ref={targetRef}
        style={style}
        className={`${className} flex`}
        {...rest} />

})

Image.displayName = `Zuz.Image`

export default Image