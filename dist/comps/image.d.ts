import { animationProps } from "./base";
import React from "react";
interface ImageProps {
    width: string | number;
    height: string | number;
    as?: string;
    animate?: animationProps;
    src: string;
    alt: string;
    crossover?: boolean;
}
declare const Image: React.ForwardRefExoticComponent<ImageProps & Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default Image;
