import { LineChartProps } from "@zuzjs/hooks";
import { BoxProps } from "../../types";

export enum CHART {
    Line = "line"
}

export type ChartProps = BoxProps & LineChartProps & {
    type?: CHART,
    animDuration?: number,
    animDelay?: number,
}