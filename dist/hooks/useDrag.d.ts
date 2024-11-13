interface Position {
    x: number;
    y: number;
}
declare const useDrag: () => {
    position: Position;
    onMouseDown: (event: React.MouseEvent) => void;
    isDragging: boolean;
};
export default useDrag;
