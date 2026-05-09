import { useIntersectionObserver } from '@zuzjs/hooks';
import { HTMLAttributes, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import Span from '../Span';
import { TextProps } from './types';

/**
 * Text component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Text>Paragraph text</Text>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Text size="lg" weight="bold" align="center" color="primary">Emphasized text</Text>
 * ```
 * @param size - Component size
 * @param weight - weight prop
 * @param align - Alignment direction
 * @param color - color prop
 */
const Text = ({
    ref,
    ...props
} : TextProps) => {

    const { 
        kind = 'h1', 
        html, children, lines, 
        tfx, 
        delay = 0,
        duration = 0.5, 
        stagger = 0.05, 
        repeat = true, 
        reveal = false, 
        hover = false,
        ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase(pops)

    const innerRef = useRef<HTMLHeadingElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const [ratio] = useIntersectionObserver([innerRef], { threshold: [1] });

    const targetOpacity = useMemo(() => {
        if (style?.opacity !== undefined) return style.opacity;
        if (typeof props.as === 'string') {
            const match = props.as.match(/opacity:([\d.]+)/);
            if (match) return match[1];
        }
        return 1;
    }, [props.as, style?.opacity]);

    // Determine if the animation should be running
    const shouldAnimate = useMemo(() => {
        if (!tfx) return false;
        if (hover) return isHovered;
        if (reveal) return ratio === 1;
        return true; // Default to always animate if fx is present and no triggers set
    }, [tfx, hover, isHovered, reveal, ratio]);

    // Sync forwarded ref with local ref
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === 'function') ref(innerRef.current as any);
        else (ref as any).current = innerRef.current;
    }, [ref]);

    const Tag = kind as `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p`

    const textContent = useMemo(() => {
        if (typeof children === 'string') return children;
        if (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string') return children[0];
        return null;
    }, [children]);

    // Detect gradient-clip text so char spans can be positioned into one continuous gradient
    const hasTextClip = useMemo(() => {
        const asStr = Array.isArray(props.as) ? props.as.join(' ') : (props.as || '');
        return typeof asStr === 'string' && asStr.includes('text-clip');
    }, [props.as]);

    // Measure after layout settles and keep spans synced if fonts or wrapping change.
    useLayoutEffect(() => {
        if (!hasTextClip || !innerRef.current || textContent === null) return;

        const parent = innerRef.current;
        let rafId = 0;
        let rafId2 = 0;

        const syncGradient = () => {
            const parentRect = parent.getBoundingClientRect();
            const bgImage = getComputedStyle(parent).backgroundImage;
            const parentWidth = parentRect.width;
            const chars = parent.querySelectorAll<HTMLSpanElement>('.--fx-char');

            chars.forEach(el => {
                const charRect = el.getBoundingClientRect();
                const offsetX = charRect.left - parentRect.left;
                el.style.backgroundImage = bgImage;
                el.style.backgroundRepeat = 'no-repeat';
                el.style.backgroundSize = `${parentWidth}px 100%`;
                el.style.backgroundPosition = `-${offsetX}px 0`;
                el.style.backgroundClip = 'text';
                (el.style as any).webkitBackgroundClip = 'text';
                el.style.color = 'transparent';
            });
        };

        const scheduleSync = () => {
            cancelAnimationFrame(rafId);
            cancelAnimationFrame(rafId2);
            rafId = requestAnimationFrame(() => {
                rafId2 = requestAnimationFrame(syncGradient);
            });
        };

        scheduleSync();

        const resizeObserver = new ResizeObserver(scheduleSync);
        resizeObserver.observe(parent);

        if (typeof document !== 'undefined' && 'fonts' in document) {
            (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(scheduleSync);
        }

        window.addEventListener('resize', scheduleSync);

        return () => {
            cancelAnimationFrame(rafId);
            cancelAnimationFrame(rafId2);
            resizeObserver.disconnect();
            window.removeEventListener('resize', scheduleSync);
        };
    }, [hasTextClip, textContent, tfx, shouldAnimate]);

    const content = useMemo(() => {
        if (html) return <Span dangerouslySetInnerHTML={{ __html: html }} />;
        
        if (tfx && textContent !== null) {
            return textContent.split('').map((char, i) => {
                const isSpace = char === ' ';
                const isEntrance = ['typewriter', 'reveal', 'fog', 'slide', 'pop'].includes(tfx);
                const finalIteration = isEntrance ? '1' : (repeat ? 'infinite' : '1');

                return (
                    <Span 
                        key={i} 
                        data-char={char} // Essential for Glitch
                        className={`--fx-char -fx ${shouldAnimate ? `--fx-${tfx}` : ''}`}
                        style={{ 
                            '--delay': `${delay + i * stagger}s`,
                            '--duration': `${duration}s`,
                            '--iteration': finalIteration,
                            '--target-opacity': targetOpacity, 
                            display: isSpace ? 'inline' : 'inline-block',
                            whiteSpace: 'pre',
                            opacity: !shouldAnimate && tfx === 'typewriter' ? 0 : undefined,
                        } as React.CSSProperties}
                    >
                        {char}
                    </Span>
                );
            });
        }

        return children;
    }, [children, html, tfx, textContent, shouldAnimate, delay, stagger, duration, repeat]);

    // console.log(tfx, children, content)

    return <Tag
        ref={innerRef}
        onMouseEnter={() => hover && setIsHovered(true)}
        onMouseLeave={() => hover && setIsHovered(false)}
        style={ tfx ? {
            ...style,
            display: tfx ? 'flex' : style?.display,
            flexWrap: tfx ? 'wrap' : style?.flexWrap,
            opacity: tfx && !shouldAnimate ? 0 : (tfx ? 1 : style?.opacity),
            transition: tfx ? 'opacity 0.4s ease' : undefined
        } : style }
        className={`${className} ${tfx ? '--text-fx -fx' : ''}`.trim()}
        {...rest as HTMLAttributes<HTMLHeadingElement>}>
        {content}
    </Tag>

}

Text.displayName = `Zuz.Text`

export default Text