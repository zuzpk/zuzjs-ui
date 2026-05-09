import { BoxProps } from "../../types";

export type GridBreakpoints = {
  ph?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
};

export interface GridProps extends Omit<BoxProps, 'cols'> {
  /** Grid column template (legacy shorthand). Prefer `columns` for readability. Can be a number, string, or breakpoint object. */
  cols?: string | number | GridBreakpoints;
  /** Grid column template. Number values map to `repeat(n, 1fr)`. Can be a number, string, or breakpoint object. */
  columns?: string | number | GridBreakpoints;
  /** Grid row template. Number values map to `repeat(n, 1fr)`. Can be a number, string, or breakpoint object. */
  rows?: string | number | GridBreakpoints;

  /** CSS `gap`. */
  gap?: string | number;
  /** CSS `column-gap` (legacy shorthand). Prefer `columnGap`. */
  gapX?: string | number;
  /** CSS `row-gap` (legacy shorthand). Prefer `rowGap`. */
  gapY?: string | number;
  /** CSS `column-gap`. */
  columnGap?: string | number;
  /** CSS `row-gap`. */
  rowGap?: string | number;

  /** CSS `align-items` (legacy shorthand). Prefer `alignItems`. */
  align?: "start" | "end" | "center" | "stretch";
  /** CSS `align-items`. */
  alignItems?: "start" | "end" | "center" | "stretch";
  /** CSS `justify-content` (legacy shorthand). Prefer `justifyContent`. */
  justify?: "start" | "end" | "center" | "stretch" | "between" | "around";
  /** CSS `justify-content`. */
  justifyContent?: "start" | "end" | "center" | "stretch" | "between" | "around";

  /** Use `inline-grid` instead of `grid`. */
  inline?: boolean;
  /** CSS `grid-auto-flow` (legacy shorthand). Prefer `autoFlow`. */
  flow?: "row" | "column" | "dense" | "row dense" | "column dense";
  /** CSS `grid-auto-flow`. */
  autoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";

  /** CSS `grid-auto-columns` (legacy shorthand). Prefer `autoColumns`. */
  autoCols?: string;
  /** CSS `grid-auto-columns`. */
  autoColumns?: string;
  /** CSS `grid-auto-rows` (legacy shorthand). Prefer `autoRow`. */
  autoRows?: string;
  /** CSS `grid-auto-rows`. */
  autoRow?: string;

  /** CSS `grid-template-areas` (legacy shorthand). Prefer `areas`. */
  template?: string;
  /** CSS `grid-template-areas`. */
  areas?: string;
}