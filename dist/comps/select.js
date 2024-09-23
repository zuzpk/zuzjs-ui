"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import With from "./base";
import { uuid } from "../funs";
const chevronExpand = () => _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-chevron-expand", viewBox: "0 0 16 16", children: _jsx("path", { fillRule: "evenodd", d: "M3.646 9.146a.5.5 0 01.708 0L8 12.793l3.646-3.647a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 010-.708zm0-2.292a.5.5 0 00.708 0L8 3.207l3.646 3.647a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0l-4 4a.5.5 0 000 .708z" }) });
const Select = forwardRef((props, ref) => {
    const { as, options, name, label, defaultValue, onChange, ...rest } = props;
    const _ref = useRef(null);
    const _id = useMemo(() => name || uuid(), []);
    const [choosing, setChoosing] = useState(false);
    const [value, setValue] = useState(defaultValue || options[0]);
    const updateValue = (o) => {
        setValue(o);
        onChange && onChange(o);
    };
    useEffect(() => {
        document.body.addEventListener(`click`, (e) => {
            setChoosing(false);
        });
    }, []);
    return _jsxs(_Fragment, { children: [_jsxs(With, { popovertarget: _id, tag: `button`, as: as, className: `zuz-select rel flex aic`, ref: _ref, onClick: (e) => setChoosing(true), ...rest, children: [_jsx(With, { tag: `h2`, className: `zuz-selected`, children: value ? `string` == typeof value ? value : value.value : label || `Choose` }), chevronExpand()] }), _jsx(With, { popover: true, id: _id, className: `zuz-select-options abs flex cols`, style: {
                    pointerEvents: choosing ? `auto` : `none`,
                }, animate: {
                    from: { height: 0, opacity: 0 },
                    to: { height: `auto`, opacity: 1 },
                    when: choosing,
                    curve: `spring`,
                    duration: .4
                }, children: options.map((o) => _jsx(With, { onClick: (e) => updateValue(o), className: value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``, tag: `button`, children: `string` == typeof o ? o : o.label }, `option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`)) })] });
});
export default Select;
