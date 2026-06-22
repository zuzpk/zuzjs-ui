import { ReactNode } from "react";
import { BoxProps } from "../../types";

export type LightboxProps = BoxProps & {
    images: string[];
    startIndex?: number;
    isOpen?: boolean;
    onClose?: () => void;
    renderItem?: (src: string, index: number, activeIndex: number) => ReactNode;
};

export default LightboxProps;
