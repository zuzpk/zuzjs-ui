import { useIntersectionObserver } from '@zuzjs/hooks';
import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import Span from '../Span';
import { TextProps } from './types';

const Text = ({
    ref,
    ...props
} : TextProps) => {

    const { 
        h, html, children, lines, 
        tfx, 
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

    const Tag = `h${props.h || 1}` as `h1` | `h2` | `h3` | `h4` | `h5` | `h6`

    const content = useMemo(() => {
        if (html) return <Span dangerouslySetInnerHTML={{ __html: html }} />;
        
        if (tfx && typeof children === 'string') {
            return children.split('').map((char, i) => {
                const isSpace = char === ' ';
                const isEntrance = ['typewriter', 'reveal', 'fog', 'slide', 'pop'].includes(tfx);
                const finalIteration = isEntrance ? '1' : (repeat ? 'infinite' : '1');
                

                return (
                    <Span 
                        key={i} 
                        data-char={char} // Essential for Glitch
                        className={`--fx-char ${shouldAnimate ? `--fx-${tfx}` : ''}`}
                        style={{ 
                            '--delay': `${i * stagger}s`,
                            '--duration': `${duration}s`,
                            '--iteration': finalIteration,
                            '--target-opacity': targetOpacity, // Pass the final goal here
                            display: isSpace ? 'inline' : 'inline-block',
                            whiteSpace: 'pre',
                            // If reveal is on but not yet triggered, hide everything
                            // opacity: (reveal && ratio < 1) ? 0 : undefined
                            opacity: !shouldAnimate && tfx === 'typewriter' ? 0 : undefined
                        } as React.CSSProperties}
                    >
                        {char}
                    </Span>
                );
            });
        }

        return children;
    }, [children, html, tfx, shouldAnimate, stagger, duration, repeat]);

    return <Tag
        ref={innerRef}
        onMouseEnter={() => hover && setIsHovered(true)}
        onMouseLeave={() => hover && setIsHovered(false)}
        style={{
            ...style,
            display: tfx ? 'flex' : style?.display,
            flexWrap: tfx ? 'wrap' : style?.flexWrap,
            opacity: tfx && !shouldAnimate ? 0 : (tfx ? 1 : style?.opacity),
            transition: tfx ? 'opacity 0.4s ease' : undefined
        }}
        className={`${className} ${tfx ? '--text-fx' : ''}`.trim()}
        {...rest as HTMLAttributes<HTMLHeadingElement>}>
        {content}
    </Tag>

}

Text.displayName = `Zuz.Text`

export default Text