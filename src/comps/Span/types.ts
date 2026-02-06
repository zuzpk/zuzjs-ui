import { Ref } from "react"
import { Props } from "../../types"

export type SpanProps = Props<`span`> & {
    ref?: Ref<HTMLSpanElement>
}