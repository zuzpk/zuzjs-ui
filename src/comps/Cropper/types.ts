import { BoxProps } from "../Box";

export enum CropShape {
    Circle = "circle",
    Square = "square"
}

export type CropperProps = BoxProps & {
    src: string,
    shape?: CropShape,
    size?: number
}

export interface CropHandler {
    getCropped: () => string;
    setScale: (scale: number) => void;
}