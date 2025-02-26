"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import SVGIcons from "../svgicons";
import Box from "../Box";
import { useBase } from "../../hooks";
import Button from "../Button";
import Text from "../Text";
import Input from "../Input";
import OptionItem from "./optionItem";
const Select = forwardRef((props, ref) => {
    const { selected, options, label, name, search: withSearch, searchPlaceholder, onChange, ...pops } = props;
    const [value, setValue] = useState(selected ?
        typeof selected === `string` ? options.find(fo => fo.value === selected) : selected
        : options[0]);
    const [choosing, setChoosing] = useState(false);
    const [query, setQuery] = useState(null);
    const _ref = useRef(null);
    const _search = useRef(null);
    const _did = useId();
    const _id = useMemo(() => name || _did, []);
    const { className, style, rest } = useBase(pops);
    const updateValue = (o) => {
        setValue(o);
        onChange && onChange(o);
    };
    useEffect(() => {
        document.body.addEventListener(`click`, (e) => {
            setChoosing(false);
        });
    }, []);
    useEffect(() => {
        if (choosing) {
            _search.current && _search.current.focus();
        }
        else {
            if (_search.current) {
                _search.current.value = ``;
            }
            setQuery(null);
        }
    }, [choosing]);
    return _jsxs(Box, { className: `--select ${name ? `--${name}` : ``} rel`.trim(), name: _id, children: [_jsxs(Button, { "data-value": value ? `string` == typeof value ? value : value.value : value || `-1`, className: `--selected flex aic rel ${className}`.trim(), withLabel: false, style: style, onClick: (e) => setChoosing(prev => !prev), ...rest, children: [_jsx(Text, { className: `--label`, children: value ? `string` == typeof value ? value : value.label : label || `Choose` }), _jsx(Box, { className: `--svg-arrow rel flex aic jcc`, children: choosing ? SVGIcons.arrowUp : SVGIcons.arrowDown })] }), _jsxs(Box, { id: _id, className: `--options-list flex cols abs`, style: {
                    pointerEvents: choosing ? `auto` : `none`,
                }, animate: {
                    from: { y: 5, opacity: 0 },
                    to: { y: 0, opacity: 1 },
                    when: choosing,
                    duration: .05
                }, children: [withSearch && _jsx(Input, { ref: _search, onChange: (e) => {
                            setQuery(e.target.value == `` ? null : e.target.value);
                        }, className: `--select-search`, placeholder: searchPlaceholder || `Search...` }), (query == null ? options : options.filter((o) => {
                        // return 
                        // `string` == typeof o ? 
                        // o.toLowerCase().includes(query.toLowerCase()) 
                        // : 
                        return o.label.toLowerCase().includes(query.toLowerCase()) || o.value.toLowerCase().includes(query.toLowerCase());
                    }))
                        .map((o) => _jsx(OptionItem, { updateValue: updateValue, value: value, o: o }, `option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`))] })] });
});
export default Select;
