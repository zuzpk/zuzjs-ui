import { jsx as _jsx } from "react/jsx-runtime";
const Option = props => {
    return _jsx(Button, { ...{
            onClick: (e) => updateValue(o),
            className: value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``,
        }, children: `string` == typeof o ? o : o.label }, `option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`);
};
export default Option;
