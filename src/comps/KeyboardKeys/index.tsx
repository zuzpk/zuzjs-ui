import { forwardRef, useMemo } from "react";
import { Variant } from "../../types/enums";
import Box from "../Box";
import Span from "../Span";
import { isKeyCombination, KeyboardKey, KeyboardKeyProps, KeysLabelMap, KeysMap } from "./types";

const KeyBoardKeys = forwardRef<HTMLDivElement, KeyboardKeyProps>(({
    children,
    keys,
    variant
}, ref) => {

    const _meta = useMemo(() => {
        if ( isKeyCombination(keys) ){
            let c = null
            let ks : KeyboardKey[] = String(keys).split(`+`)
                .reduce((pa, ca, i, nxt) => {
                    if ( nxt[i+1] ){
                        pa.push(ca as KeyboardKey)
                    }
                    else c = ca.toUpperCase()
                    return pa
                }, [] as KeyboardKey[])

            return {
                keys: ks,
                children: c
            }
        }
        return {
            keys,
            children: String(children).toUpperCase()
        }
    }, [keys])

    return <Box as={`--keyboard-keys --${variant || Variant.Small} flex aic`}>
        {( Array.isArray(_meta.keys) ? _meta.keys : [_meta.keys]).map((k) => <abbr
            key={k}
            title={KeysLabelMap[k]}>{KeysMap[k]}</abbr>)}
        <Span>{_meta?.children ?? children}</Span>
    </Box>

})

KeyBoardKeys.displayName = `Zuz.KeyboardKeys`

export default KeyBoardKeys