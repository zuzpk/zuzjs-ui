"use client"
import { useCallback, useEffect, useRef } from "react";
import { useMutationObserver } from "..";

export interface ScrollBreakpoint {
    [key: number]: () => void; // Example: { 15: () => console.log("Scrolled 15%") }
}

const useScrollbar = (breakpoints: ScrollBreakpoint = {}, ) => {
    
    const rootRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const thumbY = useRef<HTMLDivElement | null>(null);
    const thumbX = useRef<HTMLDivElement | null>(null);

    const isDraggingY = useRef(false);
    const isDraggingX = useRef(false);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const scrollStartY = useRef(0);
    const scrollStartX = useRef(0);
    const thumbHeight = useRef(30); // Default min height
    const thumbWidth = useRef(30); // Default min height

    const updateThumb = useCallback(() => {

        if (!containerRef.current || !thumbY.current || !thumbX.current) return;

        const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } = containerRef.current;

        //Y thumb
        const thumbSizeY = Math.max((clientHeight / scrollHeight) * clientHeight, 30); // Min thumb size: 30px
        thumbHeight.current = thumbSizeY;

        const thumbPosY = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbSizeY);

        thumbY.current.style.height = `${thumbSizeY}px`;
        thumbY.current.style.top = `${thumbPosY}px`;
        
        //X thumb
        const thumbSizeX = Math.max((clientWidth / scrollWidth) * clientWidth, 30); // Min thumb size: 30px
        thumbWidth.current = thumbSizeX;

        const thumbPosX = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbSizeX);

        thumbX.current.style.width = `${thumbSizeX}px`;
        thumbX.current.style.left = `${thumbPosX}px`;

        

        if ( thumbY.current.clientHeight == clientHeight && rootRef ){
            rootRef.current?.classList.add(`--no-y`)
        }
        else rootRef.current?.classList.remove(`--no-y`)
        
        if ( thumbX.current.clientWidth == clientWidth && rootRef ){
            rootRef.current?.classList.add(`--no-x`)
        }
        else rootRef.current?.classList.remove(`--no-x`)

    }, []);

    const postScroll = (scrollPercentY: number) => {
        updateThumb();

        // Trigger breakpoints
        Object.keys(breakpoints).forEach((key) => {
            const breakpoint = parseFloat(key);
            if (Math.abs(scrollPercentY - breakpoint) < 1) {
                breakpoints[breakpoint]?.();
            }
        });
    }

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const scrollPercentY = (scrollTop / (scrollHeight - clientHeight)) * 100;
        const scrollPercentX = (scrollLeft / (scrollWidth - clientWidth)) * 100;

        postScroll(scrollPercentY)
        postScroll(scrollPercentX)
        
    }, [breakpoints, updateThumb]);

    // Dragging logic
    const onScrollY = (e: React.MouseEvent) => {
        isDraggingY.current = true;
        dragStartY.current = e.clientY;
        scrollStartY.current = containerRef.current?.scrollTop || 0;
        document.body.style.userSelect = "none";
        if ( rootRef.current ) rootRef.current?.classList.add(`--scrolling`)
    };

    const onScrollX = (e: React.MouseEvent) => {
        isDraggingX.current = true;
        dragStartX.current = e.clientX;
        scrollStartX.current = containerRef.current?.scrollLeft || 0;
        document.body.style.userSelect = "none";
        if ( rootRef.current ) rootRef.current?.classList.add(`--scrolling`)
    };

    const handleDragMove = useCallback((e: MouseEvent) => {

        if ( !containerRef.current || !thumbY.current || !thumbX.current) return;

        const { clientHeight, scrollHeight, clientWidth, scrollWidth } = containerRef.current;

        if ( isDraggingY.current ){
            
            const maxScroll = scrollHeight - clientHeight;
            const maxThumbMove = clientHeight - thumbHeight.current;

            const deltaY = e.clientY - dragStartY.current;
            const newScrollTop = Math.min(Math.max(scrollStartY.current + (deltaY / maxThumbMove) * maxScroll, 0), maxScroll);

            containerRef.current.scrollTop = newScrollTop;
        }
        if ( isDraggingX.current ){

            const maxScrollX = scrollWidth - clientWidth;
            const maxThumbMoveX = clientWidth - thumbWidth.current;

            const deltaX = e.clientX - dragStartX.current;
            const newScrollLeft = Math.min(Math.max(scrollStartX.current + (deltaX / maxThumbMoveX) * maxScrollX, 0), maxScrollX);

            containerRef.current.scrollLeft = newScrollLeft;
        }
    }, []);

    const handleDragEnd = () => {
        isDraggingY.current = false;
        isDraggingX.current = false;
        document.body.style.userSelect = "";
        if ( rootRef.current ) rootRef.current?.classList.remove(`--scrolling`)
    };

    const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    const scrollToBottom = () => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    const scrollToLeft = () => containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    const scrollToRight = () => containerRef.current?.scrollTo({ left: containerRef.current.scrollWidth, behavior: "smooth" });

    useEffect(() => {

        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {

            e.preventDefault();
            e.stopPropagation();

            if (!containerRef.current) return;

            // Adjust scrollTop manually based on deltaY
            const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = containerRef.current;

            if ( Math.abs(e.deltaY) > Math.abs(e.deltaX) ){
                const maxScrollY = scrollHeight - clientHeight;
                let newScrollTop = scrollTop + e.deltaY;
                newScrollTop = Math.max(0, Math.min(newScrollTop, maxScrollY));
                containerRef.current.scrollTop = newScrollTop;
            }
            if ( Math.abs(e.deltaX) > Math.abs(e.deltaY) ){
                const maxScrollX = scrollWidth - clientWidth;
                let newScrollLeft = scrollLeft + e.deltaX;
                newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollX));
                containerRef.current.scrollLeft = newScrollLeft;
            }

            const scrollPercentY = (containerRef.current.scrollTop / (containerRef.current.scrollHeight - clientHeight)) * 100;
            const scrollPercentX = (containerRef.current.scrollLeft / (containerRef.current.scrollWidth - clientWidth)) * 100;

            postScroll(scrollPercentY)
            postScroll(scrollPercentX)

        };

        window.addEventListener("resize", updateThumb);
        container.addEventListener("scroll", handleScroll);
        // Prevent blocking default scrolling (fixes touchpad scrolling)
        container.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("mousemove", handleDragMove);
        document.addEventListener("mouseup", handleDragEnd);
        updateThumb();

        return () => {
            window.removeEventListener("resize", updateThumb);
            window.removeEventListener("wheel", handleWheel);
            container.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousemove", handleDragMove);
            document.removeEventListener("mouseup", handleDragEnd);
        };
    }, [handleScroll, handleDragMove, updateThumb]);

    useMutationObserver(containerRef.current, updateThumb)

    return { 
        rootRef, containerRef, thumbY, thumbX,
        scrollToTop, scrollToBottom, scrollToLeft, scrollToRight,
        onScrollY, onScrollX
    };

}
    
export default useScrollbar