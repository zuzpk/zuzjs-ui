"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@zuzjs/ui';
import { useEffect, useRef, useState } from 'react';
const TabBody = ({ size, index, active, render, content }) => {
    const _ref = useRef(null);
    const [style, setStyle] = useState({});
    useEffect(() => {
        if (_ref.current) {
            const d = _ref.current.closest(`.--track`)?.getBoundingClientRect();
            // console.log(d?.height)
            setStyle({ height: d?.height });
        }
    }, [_ref.current]);
    return _jsx(Box, { ref: _ref, style: {
            width: size.width,
            minWidth: size.width,
            maxWidth: size.width,
            opacity: active ? 1 : 0,
            transition: 'opacity 0.5s ease',
            ...style
        }, className: `--content`, children: (render || active) && content });
};
export default TabBody;
