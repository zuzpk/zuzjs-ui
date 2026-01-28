import { LineChartProps } from "../../hooks/useLineChart";
import { BoxProps } from "../Box";

export enum CHART {
    Line = "line"
}

export type ChartProps = BoxProps & LineChartProps & {
    type?: CHART,
    animDuration?: number,
    animDelay?: number,
}