import { MouseEvent, RefObject } from "react";
import { SheetHandler } from "../comps";
declare const useSheet: (sheet: RefObject<SheetHandler | null>) => {
    show: (e: MouseEvent<Element, MouseEvent> | TouchEvent) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
};
export default useSheet;
