import { useRef } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import Box from "../Box";
import { GridProps } from "./types";

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