import { CSSProperties, ReactNode, useMemo } from "react"
import { dynamicObject } from "../../types"
import Box from "../Box"
import type { Column } from "./types"

const TColumn : React.FC<Column & { 
    idx: number,
    style?: CSSProperties
}> = (props) => {

    const { idx, id, weight, style, value, render, resize, sort } = props

    return <Box style={{
        flex: weight || 1,
        ...style
    }} as={`--col flex aic`}>
        {value as ReactNode}
    </Box>

}

export default TColumn