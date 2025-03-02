import React from "react";
import { Props } from "../../types";
export interface BoxProps extends Partial<Props<`div`>> {
    name?: string;
}
declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLDivElement>>;
export default Box;
