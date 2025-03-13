"use client"
import { useCallback, useEffect, useRef, useState } from "react";

export type AnchorOptions = {
    offsetX?: number,
    offsetY?: number,
    overflow?: boolean
}

const useAnchorPosition = (
    parent?: HTMLElement,
    event?: MouseEvent,
    options: AnchorOptions = {}
) => {

    const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const { offsetX = 0, offsetY = 0, overflow = true } = options;
    const targetRef = useRef<HTMLDivElement | null>(null);

    const updatePosition = useCallback(() => {

        let top = 0;
        let left = 0;
    
        if (event) {
          // Position based on mouse event
          top = event.clientY + offsetY;
          left = event.clientX + offsetX;
        } else if (parent) {
          // Position based on parent element
          const rect = parent.getBoundingClientRect();
          top = rect.bottom + offsetY;
          left = rect.left + offsetX;
        }
    
        // Prevent overflow
        if (overflow && targetRef.current) {
          const popperRect = targetRef.current.getBoundingClientRect();
          const { innerWidth, innerHeight } = window;
    
          if (left + popperRect.width > innerWidth) {
            left = innerWidth - popperRect.width - 10; // Add padding
          }
          if (top + popperRect.height > innerHeight) {
            top = innerHeight - popperRect.height - 10;
          }
        }
    
        setPosition({ top, left });
    }, [event, parent, offsetX, offsetY, overflow]);

    useEffect(() => {
        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);
        return () => {
          window.removeEventListener("resize", updatePosition);
          window.removeEventListener("scroll", updatePosition);
        };
    }, [updatePosition]);

    return { position, targetRef };

}

export default useAnchorPosition
