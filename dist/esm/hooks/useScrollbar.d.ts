export interface ScrollBreakpoint {
    [key: number]: () => void;
}
declare const useScrollbar: (breakpoints?: ScrollBreakpoint) => {
    rootRef: import("react").RefObject<HTMLDivElement | null>;
    containerRef: import("react").RefObject<HTMLDivElement | null>;
    thumbRef: import("react").RefObject<HTMLDivElement | null>;
    scrollToTop: () => void | undefined;
    scrollToBottom: () => void | undefined;
    handleDragStart: (e: React.MouseEvent) => void;
};
export default useScrollbar;
