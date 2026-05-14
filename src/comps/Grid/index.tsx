import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import Box from "../Box";
import ScrollView from "../ScrollView";
import { GridBreakpoints, GridProps } from "./types";

/**
 * Grid component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Grid columns={3} gap={12}><div>1</div><div>2</div><div>3</div></Grid>
 * ```
 *
 * @example
 * // Responsive breakpoints
 * ```tsx
 * <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={12}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * ```
 *
 * @example
 * // Advanced usage with template and named areas
 * ```tsx
 * <Grid
 *   columns="200px 1fr"
 *   rows="60px 1fr 40px"
 *   areas={`"header header" "sidebar main" "footer footer"`}
 *   gap={8}
 * >
 *   <div style={{ gridArea: "header" }}>Header</div>
 *   <div style={{ gridArea: "sidebar" }}>Sidebar</div>
 *   <div style={{ gridArea: "main" }}>Main</div>
 *   <div style={{ gridArea: "footer" }}>Footer</div>
 * </Grid>
 * ```
 * @remarks
 * Legacy shorthand props (`cols`, `gapX`, `gapY`, `align`, `justify`, `flow`, `autoCols`, `autoRows`, `template`)
 * are still supported for backwards compatibility.
 */

const mediaQueries: Record<string, string> = {
    ph: `(max-width: 599px)`,
    sm: `(min-width: 600px) and (max-width: 767px)`,
    md: `(min-width: 768px)`,
    lg: `(min-width: 992px)`,
    xl: `(min-width: 1200px)`,
};

const isBreakpointObject = (value: any): value is GridBreakpoints => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const resolveTrackTemplate = (value?: string | number) => {
    if (typeof value === "number") return `repeat(${value}, 1fr)`;
    return value;
};

const resolveJustify = (value?: GridProps["justify"]) => {
    if (value === "between") return "space-between";
    if (value === "around") return "space-around";
    return value;
};

const toNumeric = (value: string | number | undefined, fallback: number) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

const resolveExplicitColumnCount = (value?: string | number) => {
    if (typeof value === "number" && value > 0) {
        return value;
    }

    if (typeof value === "string") {
        const repeatMatch = value.match(/repeat\(\s*(\d+)\s*,/i);
        if (repeatMatch) {
            return Number.parseInt(repeatMatch[1], 10);
        }
    }

    return null;
};

const Grid = (props: GridProps) => {

    const {
        ref,
        cols,
        rows,
        columns,
        gap,
        gapX,
        gapY,
        columnGap,
        rowGap,
        align,
        alignItems,
        justify,
        justifyContent,
        inline,
        flow,
        autoFlow,
        autoCols,
        autoRows,
        autoColumns,
        autoRow,
        template,
        areas,
        scrollView,
        scrollViewProps,
        virtualize = false,
        virtualCount,
        virtualRowHeight,
        virtualViewportHeight,
        virtualOverscanRows = 2,
        virtualItemMinWidth,
        virtualRenderItem,
        ...pops
    } = props;

    const { className, style, rest } = useBase(pops);

    const resolvedCols = columns ?? cols;
    const resolvedRows = rows;
    const resolvedGapX = columnGap ?? gapX ?? gap;
    const resolvedGapY = rowGap ?? gapY ?? gap;
    const resolvedAlign = alignItems ?? align;
    const resolvedJustify = justifyContent ?? justify;
    const resolvedFlow = autoFlow ?? flow;
    const resolvedAutoCols = autoColumns ?? autoCols;
    const resolvedAutoRows = autoRow ?? autoRows;
    const resolvedTemplate = areas ?? template;

    const viewportRef = useRef<HTMLDivElement>(null);
    const [virtualWidth, setVirtualWidth] = useState(0);
    const [measuredViewportHeight, setMeasuredViewportHeight] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const browserViewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;

    // Determine base values - use 'md' breakpoint as default, or the value itself if not a breakpoint object
    const baseColsValue = isBreakpointObject(resolvedCols) ? (resolvedCols as GridBreakpoints).md : resolvedCols;
    const baseRowsValue = isBreakpointObject(resolvedRows) ? (resolvedRows as GridBreakpoints).md : resolvedRows;

    const gridStyles: CSSProperties = {
        ...( inline ? { display: "inline-grid" } : {} ),
        gridTemplateColumns: resolveTrackTemplate(baseColsValue),
        gridTemplateRows: resolveTrackTemplate(baseRowsValue),
        columnGap: resolvedGapX,
        rowGap: resolvedGapY,
        alignItems: resolvedAlign,
        justifyContent: resolveJustify(resolvedJustify),
        gridAutoFlow: resolvedFlow,
        gridAutoColumns: resolvedAutoCols,
        gridAutoRows: resolvedAutoRows,
        gridTemplateAreas: resolvedTemplate,
        ...style,
    };

    useEffect(() => {
        if (!virtualize) return;

        const updateWidth = () => {
            const nextWidth = viewportRef.current?.clientWidth ?? browserViewportWidth;
            setVirtualWidth(nextWidth);
            const nextHeight = viewportRef.current?.clientHeight ?? 0;
            setMeasuredViewportHeight(nextHeight);
        };

        updateWidth();

        const observer = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(updateWidth)
            : null;

        if (observer && viewportRef.current) {
            observer.observe(viewportRef.current);
        }

        window.addEventListener("resize", updateWidth);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", updateWidth);
        };
    }, [virtualize]);

    // Generate responsive CSS if breakpoints are provided
    let responsiveStyleSheet = '';
    if (isBreakpointObject(resolvedCols)) {
        Object.entries(resolvedCols).forEach(([bp, val]) => {
            if (val === undefined) return;
            const query = mediaQueries[bp as keyof typeof mediaQueries];
            if (query) {
                const template = resolveTrackTemplate(val);
                responsiveStyleSheet += `@media ${query} { [data-grid-id="${className || 'grid'}"][data-grid-cols] { grid-template-columns: ${template}; } } `;
            }
        });
    }
    if (isBreakpointObject(resolvedRows)) {
        Object.entries(resolvedRows).forEach(([bp, val]) => {
            if (val === undefined) return;
            const query = mediaQueries[bp as keyof typeof mediaQueries];
            if (query) {
                const template = resolveTrackTemplate(val);
                responsiveStyleSheet += `@media ${query} { [data-grid-id="${className || 'grid'}"][data-grid-rows] { grid-template-rows: ${template}; } } `;
            }
        });
    }

    // Build data attributes for responsive cols/rows
    const dataAttrs: Record<string, string> = {};
    let dataGridId = '';
    if (isBreakpointObject(resolvedCols) || isBreakpointObject(resolvedRows)) {
        dataGridId = className || `grid-${Date.now()}`;
        dataAttrs['data-grid-id'] = dataGridId;
        if (isBreakpointObject(resolvedCols)) {
            dataAttrs['data-grid-cols'] = 'responsive';
        }
        if (isBreakpointObject(resolvedRows)) {
            dataAttrs['data-grid-rows'] = 'responsive';
        }
    }

    // Inject responsive styles if needed
    if (responsiveStyleSheet && typeof document !== 'undefined') {
        let styleEl = document.getElementById('--grid-responsive-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = '--grid-responsive-styles';
            document.head.appendChild(styleEl);
        }
        if (styleEl.textContent && !styleEl.textContent.includes(responsiveStyleSheet)) {
            styleEl.textContent += responsiveStyleSheet;
        } else if (!styleEl.textContent) {
            styleEl.textContent = responsiveStyleSheet;
        }
    }

    if (virtualize) {
        const count = typeof virtualCount === "number"
            ? virtualCount
            : Array.isArray(rest.children)
                ? rest.children.length
                : rest.children
                    ? 1
                    : 0;

        const effectiveGapX = toNumeric(resolvedGapX as string | number | undefined, 10);
        const explicitCols = !isBreakpointObject(resolvedCols)
            ? resolveExplicitColumnCount(resolvedCols)
            : null;
        const resolvedItemMinWidth = virtualItemMinWidth
            ?? (explicitCols && virtualWidth > 0
                ? Math.max(1, (virtualWidth - Math.max(0, explicitCols - 1) * effectiveGapX) / explicitCols)
                : 110);
        const widthForCalc = Math.max(virtualWidth || browserViewportWidth || resolvedItemMinWidth, resolvedItemMinWidth);
        const dynamicCols = explicitCols
            ? explicitCols
            : Math.max(1, Math.floor((widthForCalc + effectiveGapX) / (resolvedItemMinWidth + effectiveGapX)));
        const viewportHeightFromProps = toNumeric(scrollViewProps?.style?.height as string | number | undefined, 0);
        const effectiveViewportHeight = virtualViewportHeight
            ?? viewportHeightFromProps
            ?? measuredViewportHeight
            ?? 620;
        const effectiveRowHeight = virtualRowHeight ?? resolvedItemMinWidth;

        const totalRows = Math.ceil(count / dynamicCols);
        const startRow = Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - virtualOverscanRows);
        const endRow = Math.min(totalRows, Math.ceil((scrollTop + effectiveViewportHeight) / effectiveRowHeight) + virtualOverscanRows);

        const startIndex = startRow * dynamicCols;
        const endIndex = Math.min(count, endRow * dynamicCols);
        const topSpacerHeight = startRow * effectiveRowHeight;
        const bottomSpacerHeight = Math.max(0, (totalRows - endRow) * effectiveRowHeight);

        const visibleChildren: ReactNode[] = [];
        for (let index = startIndex; index < endIndex; index += 1) {
            if (virtualRenderItem) {
                visibleChildren.push(virtualRenderItem(index));
            } else if (Array.isArray(rest.children)) {
                visibleChildren.push(rest.children[index]);
            }
        }

        const virtualGridStyles: CSSProperties = {
            ...gridStyles,
            gridTemplateColumns: `repeat(${dynamicCols}, 1fr)`,
        };

        const gridNode = <>
            <Box style={{ height: topSpacerHeight }} />
            <Box
                className={["--grid", className].filter(Boolean).join(" ")}
                style={virtualGridStyles}
                {...(dataAttrs as any)}>
                {visibleChildren}
            </Box>
            <Box style={{ height: bottomSpacerHeight }} />
        </>;

        if (scrollView) {
            return <ScrollView
                ref={ref as any}
                {...scrollViewProps}
                onScroll={(event) => {
                    setScrollTop(event.currentTarget.scrollTop);
                    scrollViewProps?.onScroll?.(event);
                }}
                style={{
                    height: effectiveViewportHeight,
                    ...(scrollViewProps?.style || {}),
                }}>
                <Box ref={viewportRef}>
                    {gridNode}
                </Box>
            </ScrollView>
        }

        return <Box
            ref={ref}
            className={[className].filter(Boolean).join(" ")}
            style={{
                height: effectiveViewportHeight,
                overflowY: "auto",
                overflowX: "hidden",
            }}
            onScroll={(event: any) => setScrollTop(event.currentTarget.scrollTop)}
            {...rest as BoxProps}>
            <Box ref={viewportRef}>
                {gridNode}
            </Box>
        </Box>
    }

    return <Box
        ref={ref}
        className={["--grid", className].filter(Boolean).join(" ")}
        style={gridStyles}
        {...(dataAttrs as any)}
        {...rest as BoxProps}
    />


}

Grid.displayName = "Zuz.Grid";

export default Grid