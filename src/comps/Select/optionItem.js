import { jsx as _jsx } from "react/jsx-runtime";
import Button from "../Button";
const OptionItem = ({ value, updateValue, o }) => {
    return _jsx(Button, { onClick: (e) => updateValue(o), className: value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``, children: `string` == typeof o ? o : o.label });
};
export default OptionItem;
