import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
const MenuItem = (props) => {
    const { label, labelColor, icon, iconColor, index, className, onSelect } = props;
    return label == `-` ? _jsx(Box, { className: `--line` })
        : _jsxs(Button, { onClick: e => onSelect(), className: `--item flex aic ${className}`.trim(), children: [_jsx(Icon, { name: icon, className: `--ico`, style: iconColor ? { color: iconColor } : {} }), _jsx(Text, { className: `--lbl flex aic`, style: labelColor ? { color: labelColor } : {}, children: label })] });
};
export default MenuItem;
