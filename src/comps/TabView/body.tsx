"use client"
import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import Box from '../Box';
import { TabBodyProps } from './types';

const TabBody = ({ 
    isActive, 
    transitionType, 
    speed, 
    width, 
    render,
    index,
    onHeightChange,
    content,
} : TabBodyProps) => {

    const body = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = body.current;
        if (!element || !onHeightChange) return;

        const updateHeight = () => onHeightChange(index, Math.ceil(element.getBoundingClientRect().height));
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);
        return () => observer.disconnect();
    }, [index, onHeightChange]);

    const animationStyle = useMemo(() => {

        const base = {
            width: width > 0 ? `${width}px` : '100%',
            minWidth: width > 0 ? `${width}px` : '100%',
            flexShrink: 0,     // Critical for flex tracks
            height: 'fit-content',
            boxSizing: `border-box`
        };

        if (transitionType === "fade") {
            return {
                ...base,
                gridArea: '1 / 1 / 2 / 2',
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: `opacity ${speed}s ease-in-out`,
                zIndex: isActive ? 1 : 0
            };
        }
        if (transitionType === "scale") {
            return {
                ...base,
                gridArea: '1 / 1 / 2 / 2',
                opacity: isActive ? 1 : 0,
                transform: `scale(${isActive ? 1 : 0.95})`,
                transition: `all ${speed}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                zIndex: isActive ? 1 : 0
            };
        }
        return base
        // return { width, minWidth: width }; // Slide mode
    }, [isActive, transitionType, width, speed]);

    return <Box
        ref={body}
        style={{
            ...(animationStyle as CSSProperties)
        }} className="--content">
        {render || isActive ? content : null}
    </Box>

}

TabBody.displayName = `Zuz.TabBody`

export default TabBody;