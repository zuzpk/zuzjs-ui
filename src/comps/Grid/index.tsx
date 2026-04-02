import { useRef } from "react";
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
 * <Grid columns={3}><div>1</div><div>2</div><div>3</div></Grid>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Grid columns={4} gap="lg" minColWidth="200px"><div>Cell 1</div><div>Cell 2</div></Grid>
 * ```
 * @param columns - Number of columns
 * @param gap - Spacing between items
 * @param minColWidth - minColWidth prop
 */
const Grid = (props : GridProps) => {

    const {
        ref,
        cols,
        rows,
        gap,
        gapX,
        gapY,
        align,
        justify,
        inline,
        flow,
        autoCols,
        autoRows,
        template,
        ...pops
    } = props;
    const innerRef = useRef<HTMLDivElement>(null)

    const { className, style, rest } = useBase(pops);

    const getTemplate = (val?: string | number) => {
        if (typeof val === "number") return `repeat(${val}, 1fr)`;
        return val;
    };

    const gridStyles: React.CSSProperties = {
        display: inline ? "inline-grid" : "grid",
        gridTemplateColumns: getTemplate(cols),
        gridTemplateRows: getTemplate(rows),
        gap: gap,
        columnGap: gapX,
        rowGap: gapY,
        alignItems: align,
        justifyContent: justify === "between" ? "space-between" : justify === "around" ? "space-around" : justify,
        gridAutoFlow: flow,
        gridAutoColumns: autoCols,
        gridAutoRows: autoRows,
        gridTemplateAreas: template,
        ...style,
    };

    return <Box
        ref={ref}
        as={`--grid ${className}`.trim()}
        style={gridStyles}
        {...rest as BoxProps}
    />


}

Grid.displayName = "Zuz.Grid";

export default Grid