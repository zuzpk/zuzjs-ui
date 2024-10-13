import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from "react";
import With from "./base";
import Pencil from "../media/edit-ui";
import { TRANSITIONS } from "../types/enums";
import Lexer from "../funs/lexer";
import { copyToClipboard } from "../funs";
import { useMounted } from "../hooks";
const ComponentEditor = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState(false);
    const { title, attrs, element } = props;
    const mounted = useMounted(500);
    const getVariable = (v) => {
        const a = getComputedStyle(document.querySelector(element)).getPropertyValue(`--${v}`).trim();
        const b = getComputedStyle(document.body).getPropertyValue(`--${v}`).trim();
        const d = getComputedStyle(document.documentElement).getPropertyValue(`--${v}`).trim();
        return a || b || d;
    };
    const expandHex = (hex) => {
        if (hex.length === 4) {
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return hex;
    };
    const rangeSlider = (k, value, min, max, step, unit) => {
        return _jsxs(_Fragment, { children: [_jsx(With, { tag: `input`, type: `range`, defaultValue: value, min: min, max: max, step: step, name: `editor-prop-range-${k}`, onChange: (e) => {
                        document.querySelector(element).style.setProperty(`--${k}`, `${e.currentTarget.value}${unit || ``}`);
                        document.querySelector(`input[name="editor-prop-num-${k}"]`).value = e.currentTarget.value;
                    } }), _jsx(With, { tag: `input`, type: `number`, name: `editor-prop-num-${k}`, defaultValue: value, min: min, max: max, onChange: (e) => {
                        document.querySelector(element).style.setProperty(`--${k}`, `${e.currentTarget.value}${unit || ``}`);
                        document.querySelector(`input[name="editor-prop-range-${k}"]`).value = e.currentTarget.value;
                    } })] });
    };
    const colorPicker = (k, value) => {
        return _jsxs(_Fragment, { children: [_jsx(With, { tag: `input`, type: `color`, defaultValue: expandHex(value.toString()), name: `editor-prop-color-${k}`, onChange: (e) => {
                        document.querySelector(element).style.setProperty(`--${k}`, e.currentTarget.value);
                        document.querySelector(`input[name="editor-prop-num-${k}"]`).value = e.currentTarget.value;
                    } }), _jsx(With, { tag: `input`, name: `editor-prop-num-${k}`, defaultValue: expandHex(value.toString()), onChange: (e) => {
                        document.querySelector(element).style.setProperty(`--${k}`, `${e.currentTarget.value}`);
                        document.querySelector(`input[name="editor-prop-color-${k}"]`).value = e.currentTarget.value;
                    } })] });
    };
    const build = (at) => {
        const comps = [];
        Object.keys(at)
            .forEach((k) => {
            if (k.startsWith('@group')) {
                comps.push(_jsxs(With, { className: `group flex cols`, children: [_jsx(With, { tag: `h1`, as: `glabel`, children: at[k].label }), _jsx(With, { className: `gprops flex cols`, children: build(at[k].pops) })] }, `egroup-${k}`));
            }
            else {
                const { label, value, min, max, type, step, unit } = Lexer(at[k]);
                comps.push(_jsxs(With, { className: `prop flex aic`, children: [_jsxs(With, { className: `pop flex cols`, children: [_jsx(With, { tag: `h1`, as: `label`, children: label.split(`,`).join(` `) }), _jsx(With, { tag: `h1`, as: `l-k`, children: k })] }), _jsxs(With, { className: `pop flex aic`, children: [type == `range` && rangeSlider(k, value == `auto` ? parseFloat(getVariable(k)) : value, min, max, step || 1, unit), type == `color` && colorPicker(k, value == `auto` ? getVariable(k) : value)] })] }, `el-${k}-${label}`));
            }
        });
        return comps;
    };
    const getCode = (at) => {
        const c = [];
        Object.keys(at)
            .forEach((k) => {
            if (k.startsWith('@group')) {
                c.push(...getCode(at[k].pops));
            }
            else {
                const { label, value, min, max, type, step, unit } = Lexer(at[k]);
                c.push(`--${k}: ${value == `auto` ? type == `range` ? parseFloat(getVariable(k)) : getVariable(k) : value}${unit || ``};`);
            }
        });
        return c;
    };
    if (!mounted)
        return null;
    return _jsxs(With, { as: `comp-editor fixed`, children: [_jsx(With, { tag: `button`, as: `pencil`, onClick: (e) => setVisible(!visible), children: !visible ?
                    _jsx(With, { tag: `img`, src: `data:image/png;base64,${Pencil}` })
                    : _jsx(With, { tag: `span`, children: "\u00D7" }) }), _jsxs(With, { as: `editor-props fixed`, "aria-hidden": !visible, animate: {
                    transition: TRANSITIONS.SlideInRight,
                    when: visible,
                    duration: 0.1,
                }, children: [_jsxs(With, { as: `editor-head flex aic`, children: [_jsxs(With, { tag: `h1`, className: `head-label`, children: [title, " Editor"] }), _jsx(With, { className: `head-action`, children: _jsx(With, { tag: `button`, onClick: (e) => setCode(!code), children: code ? `Edit` : `Get Code` }) })] }), _jsx(With, { as: `editor-body flex cols rel`, children: code ? _jsxs(_Fragment, { children: [_jsx(With, { tag: `textarea`, children: getCode(attrs).join(`\n`) }), _jsx(With, { tag: `button`, className: `copy abs`, onClick: (e) => copyToClipboard(getCode(attrs).join(`\n`)).then(() => {
                                        document.querySelector(`.comp-editor .editor-props .editor-body .copy`).textContent = `Copied`;
                                        setTimeout(() => document.querySelector(`.comp-editor .editor-props .editor-body .copy`).textContent = `Copy`, 3000);
                                    }), children: "Copy" })] }) : build(attrs) })] })] });
});
export default ComponentEditor;
