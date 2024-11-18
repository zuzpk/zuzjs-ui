import { DRAG_DIRECTION } from '../types/enums';
interface Position {
    x: number;
    y: number;
}
export type DragOptions = {
    direction?: DRAG_DIRECTION;
    snap?: number;
    limits?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
};
declare const useDrag: (dragOptions?: DragOptions) => {
    position: Position;
    onMouseDown: (event: React.MouseEvent) => void;
    isDragging: boolean;
};
export default useDrag;
