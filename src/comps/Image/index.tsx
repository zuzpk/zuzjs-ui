import { forwardRef, useMemo, useRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';

export type ImageProps = Props<`img`> & {}

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
 * @param src - Source URL
 * @param alt - Alt text
 * @param width - width prop
 * @param height - height prop
 * @param objectFit - objectFit prop
 */
const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {

    const innerRef = useRef<HTMLImageElement>(null)
    const targetRef = useMemo(() => ref && typeof ref !== "function" && ref.current ? ref : innerRef, [ref])

    const {
        style,
        className,
        rest
    } = useBase<"img">(props, targetRef as any)
    
    if ( !rest.src || rest.src == `` ) return null

    return <img 
        ref={targetRef}
        style={style}
        className={`${className} flex`}
        {...rest} />

})

Image.displayName = `Zuz.Image`

export default Image