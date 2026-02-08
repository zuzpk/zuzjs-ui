"use client"
import React, { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Box from '../Box';
import { TabBodyProps } from './types';
import { useResizeObserver } from '@zuzjs/hooks';

const TabBody = ({ 
    isActive, 
    transitionType, 
    speed, 
    width, 
    render, 
    content,
    onHeightChange
} : TabBodyProps) => {

    const contentRef = useRef<HTMLDivElement>(null);
    const contentSize = useResizeObserver(contentRef);

    useEffect(() => {
        if (isActive && contentSize.height > 0) {
            onHeightChange(contentSize.height);
        }
    }, [isActive, contentSize.height]);

    const animationStyle = useMemo(() => {

        const base = {
            // width: width,      // Force exact pixels
            // minWidth: width,   // Prevent shrinking
            // maxWidth: width,   // Prevent expansion
            flexShrink: 0,     // Critical for flex tracks
            height: 'fit-content'
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
        ref={contentRef}
        style={{
            ...(animationStyle as CSSProperties)
        }} className="--content">
        {render || isActive ? content : null}
    </Box>

}

TabBody.displayName = `Zuz.TabBody`

export default TabBody;