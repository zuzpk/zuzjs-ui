import { CSSProperties, ReactNode, useState } from "react"
import { PubSub, SVGIcons } from "../.."
import Box from "../Box"
import type { Column } from "./types"

const TColumn = <T, >(props: Column<T> & { 
    idx: number,
    style?: CSSProperties,
    pubsub: PubSub,
    sortBy?: string | null
}) => {

    const { idx, id, as, weight, style, value, render, resize, sortBy, sortable, onSort } = props

    const [ _sort, setSort ] = useState<number>(0)

    const _onSort = () => {
        if ( sortable ){
            onSort?.(String(id), _sort == 1 ? -1 : 1)
            setSort(prev => prev == 1 ? -1 : 1)
        }
    }

    return <Box 
        style={{
            flex: weight || 1,
            ...style
        }}
        as={`--col flex aic ${as || ``} ${sortable ? `--sortable` : ``}`}
        onClick={_onSort}>
        <Box>
            {value as ReactNode}
        </Box>
        { idx == -1 
            && sortable
            && sortBy == id
            && <Box as={`--arrow flex aib`}>{_sort == 1 ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box> }
        {/* { idx == -1 && _sort != 0 && <Box as={`--arrow flex aib`}>{_sort == 1 ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box> } */}
        {/* { idx == -1 && _sort && <Box as={`--arrow flex aib`}>{_sort == 1 ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box> } */}
    </Box>

}

TColumn.displayName = `Column`

export default TColumn