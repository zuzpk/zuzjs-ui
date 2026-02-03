import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useRef } from "react";
import { useBase } from "../../hooks";
const Box = ({ ref, style, ...props }) => {
    const innerRef = useRef(null);
    const targetRef = useMemo(() => ref && typeof ref !== "function" && ref.current ? ref : innerRef, [ref]);
    const { style: _style, className, rest } = useBase(props, targetRef);
    return _jsx("div", { ref: ref || innerRef, style: {
            ..._style,
            ...(style || {})
        }, className: className, ...rest });
};
Box.displayName = `Zuz.Box`;
export default Box;
