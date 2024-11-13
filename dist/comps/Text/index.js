"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement, forwardRef } from 'react';
import { useBase } from '../../hooks';
import Span from '../Span';
const Text = forwardRef((props, ref) => {
    const { h, html, children, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const Tag = `h${props.h || 1}`;
    return createElement(Tag, {
        ref,
        style,
        className,
        ...rest
    }, html ? _jsx(Span, { dangerouslySetInnerHTML: { __html: html } }) : children);
});
export default Text;
