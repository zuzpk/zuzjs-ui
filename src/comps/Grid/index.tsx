import { CSSProperties } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import Box from "../Box";
import { GridProps } from "./types";

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
    const resolvedGapX = columnGap ?? gapX;
    const resolvedGapY = rowGap ?? gapY;
    const resolvedAlign = alignItems ?? align;
    const resolvedJustify = justifyContent ?? justify;
    const resolvedFlow = autoFlow ?? flow;
    const resolvedAutoCols = autoColumns ?? autoCols;
    const resolvedAutoRows = autoRow ?? autoRows;
    const resolvedTemplate = areas ?? template;

    const gridStyles: CSSProperties = {
        display: inline ? "inline-grid" : "grid",
        gridTemplateColumns: resolveTrackTemplate(resolvedCols),
        gridTemplateRows: resolveTrackTemplate(rows),
        gap: gap,
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

    return <Box
        ref={ref}
        className={["--grid", className].filter(Boolean).join(" ")}
        style={gridStyles}
        {...rest as BoxProps}
    />


}

Grid.displayName = "Zuz.Grid";

export default Grid