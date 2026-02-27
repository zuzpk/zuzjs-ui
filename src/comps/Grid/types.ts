import { BoxProps } from "../../types";

export interface GridProps extends Omit<BoxProps, 'cols'> {
  cols?: string | number;     // grid-template-columns
  rows?: string | number;     // grid-template-rows
  gap?: string | number;      // gap
  gapX?: string | number;     // column-gap
  gapY?: string | number;     // row-gap
  align?: "start" | "end" | "center" | "stretch"; // align-items
  justify?: "start" | "end" | "center" | "stretch" | "between" | "around"; // justify-items / content
  inline?: boolean;           // inline-grid
  flow?: "row" | "column" | "dense" | "row dense" | "column dense"; // grid-auto-flow
  autoCols?: string;          // grid-auto-columns
  autoRows?: string;          // grid-auto-rows
  template?: string;          // grid-template-areas
}