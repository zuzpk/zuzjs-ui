import { CSSProperties, ReactNode, useMemo } from "react"
import { dynamicObject } from "../../types"
import Box from "../Box"
import type { Column } from "./types"
import { PubSub } from "../.."

const TColumn = <T, >(props: Column<T> & { 
    idx: number,
    style?: CSSProperties,
    pubsub: PubSub
}) => {

    const { idx, id, as, weight, style, value, render, resize, sort } = props

    return <Box style={{
        flex: weight || 1,
        ...style
    }} as={`--col flex aic ${as || ``}`}>
        {value as ReactNode}
    </Box>

}

export default TColumn