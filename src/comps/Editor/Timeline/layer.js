import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import Box from "../../Box";
import Button from "../../Button";
import SVGIcons from "../../svgicons";
import Text from "../../Text";
import Prop from "./prop";
import { cssWithKeys } from "../../../funs/stylesheet";
const Layer = (props) => {
    const { meta, index, onSelect } = props;
    const { src, label } = meta;
    const style = useRef([
        { x: 0, unit: 'px' },
        { y: 0, unit: 'px' },
        { z: 0, unit: 'px' },
        { rx: 0, unit: 'deg' },
        { ry: 0, unit: 'deg' },
        { rz: 0, unit: 'deg' },
    ]);
    const [expanded, setExpanded] = useState(false);
    const [keyframes, setKeyframes] = useState([]);
    const applyStyle = (source) => {
        if (src.current) {
            const _transform = [];
            const list = source || style.current;
            list.forEach((c, i) => {
                const [k, u] = Object.keys(c);
                // _css.makeUnit(k, c[k as cssShortKey])
                _transform.push(`${cssWithKeys[k]}(${c[k]}${c.unit})`);
            });
            src.current.style.transform = _transform.join(' ');
        }
    };
    const updateStyle = (meta) => {
        const [key] = Object.keys(meta);
        // console.log(key, meta)
        const newList = style.current.map(item => {
            if (key in item) {
                return meta; //{ ...item, [key]: meta[key as cssShortKey] };
            }
            return item;
        });
        if (!newList.some(item => key in item)) {
            newList.push(meta);
        }
        style.current = newList;
        // console.log(style.current)
        applyStyle(newList);
    };
    const addKeyframe = () => {
        setKeyframes([
            ...keyframes,
            {
                stamp: 0,
                props: style.current
            }
        ]);
        console.log(keyframes);
    };
    // const updateStyleDebounced = useDebounce(updateStyle, 100)
    useEffect(() => {
        applyStyle();
        setTimeout(() => setExpanded(true), 200);
    }, []);
    return _jsxs(Box, { onClick: e => onSelect(meta), className: `--layer flex aic`, children: [_jsxs(Box, { className: `--meta flex cols`, children: [_jsxs(Box, { className: `--prop flex aic`, children: [_jsx(Button, { onClick: e => setExpanded(!expanded), className: `--chevron`, children: expanded ? SVGIcons.chevronBottom : SVGIcons.chevronRight }), _jsx(Box, { className: `--icon` }), _jsx(Text, { className: `--label bold`, children: label || `Layer ${index}` })] }), expanded && style.current.map((a, i) => _jsx(Prop, { onChange: v => updateStyle(v), addKeyframe: addKeyframe, meta: a }, `layer-${a}-${i}`))] }), _jsxs(Box, { className: `--track flex cols`, children: [_jsx(Box, { className: `--bar` }), expanded && Object.keys(style.current).map((a, i) => _jsx(Box, { className: `--bar --sub` }, `bar-style-${a}-${i}`))] })] });
};
export default Layer;
