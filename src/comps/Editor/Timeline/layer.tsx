import { forwardRef, CSSProperties, useState, useEffect, useMemo, useRef } from "react"
import Box from "../../Box"
import Button from "../../Button"
import SVGIcons from "../../svgicons"
import Text from "../../Text"
import { KeyFrame, LayerProps, LayerType, StyleItem, TimeLineLayer } from "../types"
import { cssShortKey } from "../../../types"
import Prop from "./prop"
import { cssWithKeys } from "../../../funs/stylesheet"
import { useDebounce } from "../../../hooks"
import CSS from "../../../funs/css"



const Layer = (props : LayerProps) => {

    const { meta, index, onSelect } = props
    const { src, label } = meta
    const style = useRef<StyleItem[]>([
        { x: 0, unit: 'px' },
        { y: 0, unit: 'px' },
        { z: 0, unit: 'px' },
        { rx: 0, unit: 'deg' },
        { ry: 0, unit: 'deg' },
        { rz: 0 , unit: 'deg' },
    ])
    const [ expanded, setExpanded ] = useState(false)
    const [ keyframes, setKeyframes ] = useState<KeyFrame[]>([])
    
    
    const applyStyle = (source?: StyleItem[]) => {
        
        if ( src.current ){

            const _transform : string[] = []
            const list = source || style.current
            list.forEach((c, i) => {
                const [ k, u ] = Object.keys(c)
                // _css.makeUnit(k, c[k as cssShortKey])
                _transform.push(`${cssWithKeys[k as cssShortKey]}(${c[k as cssShortKey]}${c.unit})`)
            })

            src.current.style.transform = _transform.join(' ')

        }
    }

    const updateStyle = (meta: StyleItem) => {
        const [ key ] = Object.keys(meta)
        // console.log(key, meta)
        const newList = style.current.map(item => {
            if (key in item) {
                return meta //{ ...item, [key]: meta[key as cssShortKey] };
            }
            return item;
        });
        if (!newList.some(item => key in item)) {
            newList.push(meta);
        }
        style.current = newList
        // console.log(style.current)
        applyStyle(newList)
    }

    const addKeyframe = () => {
        setKeyframes([
            ...keyframes, 
            {
                stamp: 0,
                props: style.current
            }
        ])
        console.log(keyframes)
    }
    // const updateStyleDebounced = useDebounce(updateStyle, 100)

    useEffect(() => {
        applyStyle()
        setTimeout(() => setExpanded(true), 200)
    }, [])


    return <Box 
        onClick={e => onSelect(meta)}
        className={`--layer flex aic`}>
        
        <Box className={`--meta flex cols`}>
            <Box className={`--prop flex aic`}>
                <Button 
                    onClick={e => setExpanded(!expanded)}
                    className={`--chevron`}>{expanded ? SVGIcons.chevronBottom : SVGIcons.chevronRight}</Button>
                <Box className={`--icon`} />     
                <Text className={`--label bold`}>{label || `Layer ${index}`}</Text>
            </Box>
            {expanded && style.current.map((a, i) => <Prop 
                onChange={ v => updateStyle(v) }
                addKeyframe={addKeyframe}
                key={`layer-${a}-${i}`} 
                meta={a} />)}
        </Box>

        <Box
            className={`--track flex cols`}>
            <Box className={`--bar`} />
            {expanded && Object.keys(style.current).map((a, i) => <Box key={`bar-style-${a}-${i}`} className={`--bar --sub`} />)}
        </Box>
    </Box>

}

export default Layer