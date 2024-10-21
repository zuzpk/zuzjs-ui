import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef } from "react";
import With from "./base";
const ProgressBar = forwardRef((props, ref) => {
    const { as } = props;
    const bar = useRef(null);
    useImperativeHandle(ref, () => ({
        setWidth: (progress) => {
            bar.current.style.width = `${progress * 100}%`;
        }
    }), []);
    return _jsx(With, { className: `--progress flex rel`, as: as, children: _jsx(With, { ref: bar, className: `--bar rel` }) });
});
export default ProgressBar;
