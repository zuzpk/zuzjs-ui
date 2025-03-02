import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
const TabItem = ({ tab, index, activeTab, onClick }) => {
    const { icon, label } = tab;
    return _jsxs(Button, { onClick: e => onClick(index), className: `--tab jcc ${index === activeTab ? '--active' : ''}`.trim(), children: [icon && (typeof icon === 'string' ? _jsx(Icon, { className: `--icon`, name: icon }) : icon), _jsx(Text, { className: `--label rel`, children: label })] });
};
export default TabItem;
