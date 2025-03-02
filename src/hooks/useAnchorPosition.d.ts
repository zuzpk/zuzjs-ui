import { RefObject } from "react";
export type AnchorOptions = {
    offsetX?: number;
    offsetY?: number;
    overflow?: boolean;
};
declare const useAnchorPosition: (parent?: HTMLElement, event?: MouseEvent, options?: AnchorOptions) => {
    position: {
        top: number;
        left: number;
    };
    targetRef: RefObject<HTMLDivElement | null>;
};
export default useAnchorPosition;
