import { jsx as _jsx } from "react/jsx-runtime";
import Button from '../Button';
import Icon from '../Icon';
const ActionItem = ({ label, icon, onClick, idx, selected }) => {
    return _jsx(Button, { onClick: onClick, onMouseMove: e => document.documentElement.style.setProperty(`--tip-m`, `${idx}`), className: `--action ${selected ? `--selected` : ``} aic jcc rel`.trim(), children: typeof icon == `string` ? _jsx(Icon, { name: icon }) : icon });
};
export default ActionItem;
