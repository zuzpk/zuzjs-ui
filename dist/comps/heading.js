import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Heading = forwardRef((props, ref) => {
    const { as, h, html, ...rest } = props;
    return _jsx(With, { tag: `h${h || 1}`, as: as, ref: ref, ...rest, children: props.children ?
            props.html ? _jsx("span", { ...({ dangerouslySetInnerHTML: { __html: html } }) }) : props.children
            : null });
});
export default Heading;
