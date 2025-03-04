import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import Span from '../Span';
const Text = forwardRef((props, ref) => {
    const { h, html, children, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const Tag = `h${props.h || 1}`;
    return _jsx(Tag, { ref: ref, style: style, className: className, ...rest, children: html ? _jsx(Span, { dangerouslySetInnerHTML: { __html: html } }) : children });
});
Text.displayName = `Text`;
export default Text;
