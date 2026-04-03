import { ReactNode } from "react";
import { BoxProps, Placement, ValueOf, Variant } from "../../types";

export type FieldsetProps = BoxProps & {
    legend?: string | ReactNode;
    legendPlacement?: Placement;
    variant?: ValueOf<typeof Variant>;
}