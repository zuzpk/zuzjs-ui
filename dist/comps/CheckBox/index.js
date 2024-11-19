"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CHECKBOX, Size } from "../../types/enums";
import Label from "../Label";
import Input from "../Input";
import SVGIcons from "../svgicons";
const CheckBox = forwardRef((props, ref) => {
    const { name, required, type, value, size, checked: defaultCheck, onChange, ...pops } = props;
    const [checked, _setChecked] = useState(defaultCheck || false);
    const bRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange = true) {
            _setChecked(mod);
            if (bRef.current) {
                bRef.current.checked = mod;
            }
            if (triggerChange && onChange)
                onChange(mod, value || `cb`);
        },
        toggle(triggerChange = true) {
            if (bRef.current)
                bRef.current.checked = !checked;
            if (triggerChange && onChange)
                onChange && onChange(!checked, value || `cb`);
            _setChecked(!checked);
        }
    }));
    return _jsxs(Label, { className: `--${(type || CHECKBOX.Default).toLowerCase()} ${!type || type == CHECKBOX.Default ? `--checkbox` : `--switch`} --${size || Size.Default} flex aic jcc ${checked ? `is-checked` : ``} rel`.trim(), ...pops, children: [(!type || type == CHECKBOX.Default) && SVGIcons.check, _jsx(Input, { ...{}, ref: bRef, defaultChecked: checked, value: value || `cb`, type: `checkbox`, className: `abs`, name: name, required: required || false, onChange: (e) => {
                    onChange && onChange(e.target.checked, value || `cb`);
                    _setChecked(e.target.checked);
                } })] });
});
// import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref, useState } from "react";
// import { cleanProps, css } from "../funs";
// import { UIProps } from "../types/interfaces";
// const CheckBox = ( props : UIProps<HTMLInputElement> ) => {
//     const { cx } = css.Build(props.as)
//     const [ checked, setChecked ] = useState(props.checked || false)
//     return <label { ...({
//         className: `zuz-checkbox${checked ? ` is-checked` : ``} rel${cx.length > 0 ? ` ` + cx.join(` `) : ``}`
//     }) as UIProps<HTMLLabelElement>}>
//         <input type='checkbox' 
//             ref={props.ref}
//             onChange={e => {
//                 setChecked(e.target.checked)
//             }}
//             className={`abs`}
//             {...(cleanProps(props) as UIProps<HTMLInputElement>)} />
//     </label>
// }
export default CheckBox;
