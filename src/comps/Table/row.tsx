import Box from "../Box"
import TColumn from "./col"
import type { Column, Row } from "./types"

const TRow = (props: Row) => {

    const { index, schema, data, ids, styles } = props

    return <Box as={`--row flex aic ${index == -1 ? `--row-head` : ``}`}>
        {index == -1 && schema.map((c: Column, i: number) => <TColumn key={`--col-${c.id}`} idx={-1} {...c} style={styles[c.id]} />)}
        {index > -1 && ids && data && schema.map((c: Column, i: number) => {
            return ids.includes(String(c.id)) ? <TColumn 
                key={`--${String(c.id)}-val-${i}`} 
                idx={i} 
                id={String(c.id)}
                style={styles[String(c.id)]}
                value={c.render ? c.render!(data) : data[String(c.id)]} 
            /> : null
        })}
    </Box>

}

export default TRow