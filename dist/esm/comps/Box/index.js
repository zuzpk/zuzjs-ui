import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
const Box = forwardRef((props, ref) => {
    const { style, withEditor, ...pops } = props;
    const { style: _style, className, rest } = useBase(pops);
    const handleInternalClick = (e) => {
        // if ( withEditor && isBrowser ) {
        //     // window.dispatchEvent(new CustomEvent(`ZUZ_COMP_SELECTED`, {
        //     //     detail: {
        //     //         compName: 'Box',
        //     //         target: e.target,
        //     //         props
        //     //     }
        //     // }))
        // }
    };
    return _jsx("div", { ref: ref, onClick: handleInternalClick, className: `${className} ${withEditor ? `--with-zuz-editor` : ``}`.trim(), style: {
            ..._style,
            ...(style || {})
        }, ...rest });
});
Box.displayName = `Box`;
export default Box;
