import Box from "../Box"
import TColumn from "./col"
import type { Column, Row } from "./types"

const TRow = (props: Row) => {

    const { index, schema, data, ids, styles } = props

    return <Box as={`--row flex aic ${index == -1 ? `--row-head` : ``}`}>
        {index == -1 && schema.map((c: Column, i: number) => <TColumn key={`--col-${c.id}`} idx={-1} {...c} style={styles[c.id]} />)}
        {index > -1 && ids && data && Object.keys(data).map((k: string, i: number) => {
            const _item = schema.find(s => s.id == k) as Column;
            // const style = {
            //     ...(_item?.w && { width: _item.w }),
            //     ...(_item?.maxW && { maxWidth: _item.maxW }),
            //     ...(_item?.minW && { minWidth: _item.minW }),
            //     ...(_item?.h && { height: _item.h }),
            //     ...(_item?.maxH && { maxHeight:_item.maxH }),
            //     ...(_item?.minH && { minHeight: _item.minH }),
            // }
            return ids.includes(k) ? <TColumn 
                key={`--${k}-val-${i}`} 
                idx={i} 
                id={k}
                style={styles[k]}
                value={_item?.render ? _item?.render!(data) : data[k]} 
            /> : null
        })}
    </Box>

}

export default TRow