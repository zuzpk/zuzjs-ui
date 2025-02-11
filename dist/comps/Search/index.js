"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import Input from '../Input';
import Box from '../Box';
import Button from '../Button';
import SVGIcons from '../svgicons';
import { Size } from '../../types/enums';
const Search = forwardRef((props, ref) => {
    const { animate, withStyle, onChange, ...pops } = props;
    const { style } = useBase(pops);
    const { className: searchStyle } = useBase({ as: withStyle || `` });
    const [query, setQuery] = useState(``);
    const innerRef = useRef(null);
    if (`type` in props) {
        delete props[`type`];
    }
    const handleChange = (e) => {
        setQuery(e.target.value);
        onChange?.(e.target.value);
    };
    const handleSubmit = (e) => {
        e?.preventDefault();
        if (query.trim() !== ``) {
            setQuery(``);
            onChange?.(``);
            if (innerRef.current) {
                innerRef.current.value = ``;
            }
        }
        // onSubmit?.(query)
    };
    useEffect(() => { }, []);
    return _jsxs(Box, { style: style, className: `--search --${props.size || Size.Small} flex aic rel ${searchStyle}`.trim(), children: [_jsx(Input, { ref: innerRef, onChange: handleChange, className: `--${props.size || Size.Small}`, ...pops }), _jsx(Button, { tabIndex: -1, onClick: e => handleSubmit(), className: `--send flex aic jcc abs`, size: props.size || Size.Small, children: query !== `` ? SVGIcons.close : SVGIcons.search })] });
});
export default Search;
