import { useCallback, useEffect, useRef } from "react";
const useScrollbar = (breakpoints = {}) => {
    const rootRef = useRef(null);
    const containerRef = useRef(null);
    const thumbRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartY = useRef(0);
    const scrollStartY = useRef(0);
    const thumbHeight = useRef(30); // Default min height
    const updateThumb = useCallback(() => {
        if (!containerRef.current || !thumbRef.current)
            return;
        const { clientHeight, scrollHeight, scrollTop } = containerRef.current;
        const thumbSize = Math.max((clientHeight / scrollHeight) * clientHeight, 30); // Min thumb size: 30px
        thumbHeight.current = thumbSize;
        const thumbPos = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbSize);
        // Apply styles directly
        thumbRef.current.style.height = `${thumbSize}px`;
        thumbRef.current.style.top = `${thumbPos}px`;
        if (thumbRef.current.clientHeight == clientHeight && rootRef) {
            rootRef.current?.classList.add(`--no-need`);
        }
        else
            rootRef.current?.classList.remove(`--no-need`);
    }, []);
    const postScroll = (scrollPercent) => {
        updateThumb();
        // Trigger breakpoints
        Object.keys(breakpoints).forEach((key) => {
            const breakpoint = parseFloat(key);
            if (Math.abs(scrollPercent - breakpoint) < 1) {
                breakpoints[breakpoint]?.();
            }
        });
    };
    const handleScroll = useCallback(() => {
        if (!containerRef.current)
            return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        postScroll(scrollPercent);
    }, [breakpoints, updateThumb]);
    // Dragging logic
    const handleDragStart = (e) => {
        isDragging.current = true;
        dragStartY.current = e.clientY;
        scrollStartY.current = containerRef.current?.scrollTop || 0;
        document.body.style.userSelect = "none";
        if (rootRef.current)
            rootRef.current?.classList.add(`--scrolling`);
    };
    const handleDragMove = useCallback((e) => {
        if (!isDragging.current || !containerRef.current || !thumbRef.current)
            return;
        const { clientHeight, scrollHeight } = containerRef.current;
        const maxScroll = scrollHeight - clientHeight;
        const maxThumbMove = clientHeight - thumbHeight.current;
        const deltaY = e.clientY - dragStartY.current;
        const newScrollTop = Math.min(Math.max(scrollStartY.current + (deltaY / maxThumbMove) * maxScroll, 0), maxScroll);
        containerRef.current.scrollTop = newScrollTop;
    }, []);
    const handleDragEnd = () => {
        isDragging.current = false;
        document.body.style.userSelect = "";
        if (rootRef.current)
            rootRef.current?.classList.remove(`--scrolling`);
    };
    const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    const scrollToBottom = () => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!containerRef.current)
                return;
            // Adjust scrollTop manually based on deltaY
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const maxScroll = scrollHeight - clientHeight;
            // Calculate new scroll position
            let newScrollTop = scrollTop + e.deltaY;
            // Clamp the scroll position within bounds
            newScrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
            // Apply the new scroll position
            containerRef.current.scrollTop = newScrollTop;
            const scrollPercent = (containerRef.current.scrollTop / (containerRef.current.scrollHeight - clientHeight)) * 100;
            postScroll(scrollPercent);
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
    return { rootRef, containerRef, thumbRef, scrollToTop, scrollToBottom, handleDragStart };
};
export default useScrollbar;
