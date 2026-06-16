import { BoxProps } from "../../types";

export enum CropShape {
    Circle = "circle",
    Square = "square"
}

export type CropperProps = BoxProps & {
    src: string,
    shape?: CropShape,
    size?: number,
    value?: number
}

export interface CropHandler {
    getCropped: () => string;
    setScale: (scale: number) => void;
}