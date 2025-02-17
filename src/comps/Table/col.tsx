import { CSSProperties, ReactNode, useMemo } from "react"
import { dynamicObject } from "../../types"
import Box from "../Box"
import type { Column } from "./types"

const TColumn : React.FC<Column & { 
    idx: number,
    style?: CSSProperties
}> = (props) => {

    const { idx, id, weight, style, value, render, resize, sort } = props

    // const style = useMemo(() : CSSStyleDeclaration => style || {
    //     ...(w && { width: w }),
    //     ...(maxW && { maxWidth: maxW }),
    //     ...(minW && { minWidth: minW }),
    //     ...(h && { height: h }),
    //     ...(maxH && { maxHeight: maxH }),
    //     ...(minH && { minHeight: minH }),
    // }), [w, maxW, minW, h, minH, maxH, weight]);

    return <Box style={{
        flex: weight || 1,
        ...style
    }} as={`--col flex aic`}>
        {value as ReactNode}
        {/* {idx && idx > -1 && render ? render(value) : value} */}
    </Box>

}

export default TColumn