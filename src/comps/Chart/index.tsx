"use client"
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { UseLineChartDimensions, useResizeObserver } from "../..";
import useBase from "../../hooks/useBase";
import useLineChart from "../../hooks/useLineChart";
import Box, { BoxProps } from "../Box";
import { CHART, ChartProps } from "./types";

const Chart = forwardRef<HTMLDivElement, ChartProps>((props, ref) => {

    const { 
        data, 
        width, 
        height, 
        lineColor, 
        strokeWidth = 2, 
        gradientStartColor, 
        gradientEndColor,
        animated,
        animDuration = 2,
        animDelay = 0,
        padding = 0,
        type,
        ...pops 
    } = props;
    
    const {
        className,
        style,
        rest
    } = useBase(pops)

    const innerRef = useRef<HTMLDivElement>(null)
    
    // State to store the actual dimensions of the container
    const observedDimensions = useResizeObserver(innerRef.current?.parentElement || innerRef);
    
    const chartWidth = typeof width === 'number' ? width : observedDimensions.width;
    const chartHeight = typeof height === 'number' ? height : observedDimensions.height;

    const dimensionsForChartHook: UseLineChartDimensions = {
        width: chartWidth,
        height: chartHeight
    };
    
    // Generate a unique ID for the gradient to avoid conflicts if multiple charts are on the page
    const gradientId =  useId() //`chartGradient-${Math.random().toString(36).substring(2, 9)}`;

    // Use the custom hook to get the SVG path data and area path data
    const { pathD, areaPathD } = useLineChart(data, dimensionsForChartHook, (padding + (strokeWidth || 2)) );

    // Refs for the path elements to get their total length for animation
    const linePathRef = useRef<SVGPathElement>(null);
    const areaPathRef = useRef<SVGPathElement>(null);

    // State to store the calculated lengths of the paths
    const [linePathLength, setLinePathLength] = useState<number>(0);
    const [areaPathLength, setAreaPathLength] = useState<number>(0);

    useEffect(() => {
        if (animated) {
            if (linePathRef.current) {
                // Get the total length of the line path for stroke-dasharray animation
                setLinePathLength(linePathRef.current.getTotalLength());
            }
            if (areaPathRef.current) {
                // Get the total length of the area path for stroke-dasharray animation
                setAreaPathLength(areaPathRef.current.getTotalLength());
            }
        }
    }, [animated, pathD, areaPathD, chartWidth, chartHeight]);

    return <Box 
        ref={innerRef}
        as={`--chart --${type || CHART.Line}-chart ${className}`.trim()}
        style={{
            ...style,
            width,
            height
        }}
        {...rest as BoxProps}>
            {/* Render SVG only if valid dimensions are available */}
            {chartWidth > 0 && chartHeight > 0 && <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet" // Ensures the SVG scales nicely
        >

            <defs>
                {/* Define the linear gradient for the fill */}
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={gradientStartColor} />
                    <stop offset="100%" stopColor={gradientEndColor} />
                </linearGradient>
            </defs>

            {/* Path for the gradient-filled area */}
            <path
                ref={areaPathRef} // Assign ref to get path length
                d={areaPathD}
                fill={`url(#${gradientId})`} // Apply the gradient fill
                stroke="none" // No stroke for the area
                // Apply animation properties if 'animated' is true
                style={animated ? {
                    strokeDasharray: areaPathLength,
                    strokeDashoffset: areaPathLength,
                } : {}}>
                {/* SVG animate tag for drawing the area path */}
                {animated && (
                    <animate
                        attributeName="stroke-dashoffset"
                        from={areaPathLength}
                        to="0"
                        dur={`${animDuration || 2}s`}
                        begin={`${animDelay || 0}s`}
                        fill="freeze"
                    />
                )}
            </path>

            {/* Path for the line itself */}
            <path
                ref={linePathRef} // Assign ref to get path length
                d={pathD}
                fill="none" // No fill for the line
                stroke={lineColor} // Line color
                strokeWidth={strokeWidth} // Line thickness
                strokeLinecap="round" // Rounded line caps
                strokeLinejoin="round" // Rounded line joins
                    // Apply animation properties if 'animated' is true
                style={animated ? {
                    strokeDasharray: linePathLength,
                    strokeDashoffset: linePathLength,
                } : {}} >
                {/* SVG animate tag for drawing the line path */}
                {animated && (
                    <animate
                        attributeName="stroke-dashoffset"
                        from={linePathLength}
                        to="0"
                        dur={`${animDuration || 2}s`}
                        begin={`${animDelay || 0}s`}
                        fill="freeze" // Keep the final state
                    />
                )}
            </path>

        </svg>}
    </Box>

})

Chart.displayName = `Zuz.Chart`

export default Chart