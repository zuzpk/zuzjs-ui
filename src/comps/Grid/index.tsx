import { CSSProperties } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import Box from "../Box";
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