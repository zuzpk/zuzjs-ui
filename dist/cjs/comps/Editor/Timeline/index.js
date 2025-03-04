"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, useState } from "react";
import { DRAG_DIRECTION, SLIDER } from "../../../types/enums";
import Box from "../../Box";
import Button from "../../Button";
import Slider from "../../Slider";
import SVGIcons from "../../svgicons";
import Text from "../../Text";
import ToolTip from "../../Tooltip";
import Layer from "./layer";
const Timeline = forwardRef((props, ref) => {
    const { layers } = props;
    const [selected, setSelected] = useState([]);
    const [duration, setDuration] = useState(1);
    const sideBar = useRef(null);
    const cursorLimit = useRef({ left: 0, right: 0, snap: 1 });
    const onLayerSelect = (layer) => {
        const { src } = layer;
        if (src) {
            const { width, height, x, y } = src.current.getBoundingClientRect();
            src.current.classList.add(`--with-timeline`);
        }
        if (selected.includes(layer)) {
            setSelected(selected.filter(a => a !== layer));
        }
        else {
            setSelected([...selected, layer]);
        }
    };
    const buildTimelineStamps = (step = 0.1) => {
        const stamps = [];
        for (let i = 0; i < duration; i += step) {
            stamps.push(_jsx(Text, { className: `--stmp`, children: i.toFixed(1) }, `tstmp-${i}`));
        }
        return stamps;
    };
    useEffect(() => {
        if (sideBar.current) {
            const w = document.querySelector(`.--head .--track .--stamps .--stmp`).getBoundingClientRect().width;
            cursorLimit.current = {
                left: 0, //sideBar.current.offsetLeft,
                right: window.innerWidth - sideBar.current.offsetWidth - 10,
                snap: w
            };
        }
    }, [duration]);
    // console.log(cursorLimit.current)
    return _jsxs(Box, { className: `--timeline fixed flex`, children: [_jsxs(Box, { className: `--layers flex cols`, children: [_jsxs(Box, { className: `--layer --head flex aic`, children: [_jsxs(Box, { ref: sideBar, className: `--meta flex aic jcc`, children: [_jsxs(Box, { className: `--buns flex aic`, children: [_jsx(Button, { className: `--pbtn`, children: SVGIcons.prev }), _jsx(Button, { className: `--pbtn`, children: SVGIcons.play }), _jsx(Button, { className: `--pbtn`, children: SVGIcons.next })] }), _jsxs(Box, { className: `--bus flex aic`, children: [_jsx(ToolTip, { title: `Duration`, children: _jsxs(Box, { className: `--choose-time flex aic jcc`, children: [_jsx(Slider, { onChange: e => setDuration(e), value: 1, type: SLIDER.Text, min: 1, max: 10, step: 1 }), _jsx(Text, { className: `--duration`, children: "s" })] }) }), _jsx(ToolTip, { title: `Add Style`, children: _jsx(Button, { className: `--pbtn`, children: SVGIcons.add }) })] })] }), _jsx(Box, { className: `--track flex aic`, children: _jsx(Box, { as: `--stamps flex aic`, children: buildTimelineStamps() }) })] }), layers && layers.length > 0 && layers.map((a, i) => _jsx(Layer, { meta: a, index: i + 1, selected: selected.includes(a), onSelect: onLayerSelect }, `layer-track-${i}`))] }), _jsx(Box, { draggable: true, dragOptions: {
                    direction: DRAG_DIRECTION.x,
                    snap: cursorLimit.current.snap,
                    limits: {
                        left: cursorLimit.current.left,
                        right: cursorLimit.current.right
                    }
                }, className: `--cursor abs` })] });
});
Timeline.displayName = `Timeline`;
export default Timeline;
