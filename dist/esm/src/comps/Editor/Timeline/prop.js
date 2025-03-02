import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { cssWithKeys } from "../../../funs/stylesheet";
import { SLIDER } from "../../../types/enums";
import Box from "../../Box";
import Button from "../../Button";
import Select from "../../Select";
import Slider from "../../Slider";
import SVGIcons from "../../svgicons";
import Text from "../../Text";
const Prop = (props) => {
    const { meta, onChange, addKeyframe } = props;
    const [k, u] = Object.keys(meta);
    const [unit, setUnit] = useState(meta.unit);
    const [value, setValue] = useState(meta[k]);
    const handleChange = (e) => {
        onChange({
            [k]: e || value,
            unit: unit
        });
    };
    return _jsxs(Box, { className: `--sub-prop flex aic`, children: [_jsx(Button, { onClick: e => addKeyframe(), className: `--add-key`, children: SVGIcons.addKey }), _jsx(Text, { className: `--plbl`, children: cssWithKeys[k] }), _jsxs(Box, { className: `--value flex aic jce`, children: [_jsx(Slider, { onChange: e => handleChange(e), min: -100, max: 100, step: 1, roundValue: true, type: SLIDER.Text }), _jsx(Select, { onChange: (v) => {
                            setUnit(v.value);
                            handleChange((+v.value));
                        }, selected: meta.unit, options: [
                            { label: `px`, value: `px` },
                            { label: `vw`, value: `vw` },
                            { label: `vh`, value: `vh` },
                            { label: `%`, value: `%` },
                            { label: `deg`, value: `deg` },
                        ] })] })] });
};
export default Prop;
