import { Props } from '../../types';
export type ImageProps = Props<`img`> & {};
declare const Image: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof import("../../types").ZuzProps> & import("react").RefAttributes<HTMLImageElement>>;
export default Image;
