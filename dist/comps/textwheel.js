import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import With from "./base";
const TextWheel = forwardRef((props, ref) => {
    const { as, value, color, direction, ...rest } = props;
    return _jsxs(With, { className: `text-wheel flex aic rel`, "aria-hidden": true, as: as, ref: ref, ...rest, children: [value.toString().split('').map((char, index) => {
                if (isNaN(parseInt(char, 10))) {
                    return _jsx(With, { tag: `span`, className: "wheel-char wheel-char-symbol grid", children: char }, `wheel-char-${index}`);
                }
                return _jsx(With, { tag: `span`, "data-value": char, className: `wheel-char grid ${index > char.toString().split('').length - 3 ? 'wheel-fraction' : ''}`.trim(), children: _jsxs(With, { tag: `span`, className: `wheel-char-track wheel-track-${direction || `down`} grid`, style: {
                            '--v': char
                        }, children: [_jsx(With, { tag: `span`, children: !direction || direction == `down` ? 0 : 9 }), (!direction || direction == `down` ?
                                [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
                                : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).map((val, indx) => {
                                return _jsx(With, { tag: `span`, children: val }, `${index}--${indx}`);
                            }), _jsx(With, { tag: `span`, children: !direction || direction == `down` ? 9 : 0 })] }) }, `wheel-char-${index}`);
            }), color && _jsx(With, { className: `abs fill`, style: {
                    zIndex: 1,
                    background: `linear-gradient(0deg, ${color}, transparent, transparent, transparent, ${color})`,
                } })] });
});
export default TextWheel;
