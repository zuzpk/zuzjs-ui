import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useState } from "react";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import SVGIcons from "../svgicons";
const TreeItem = forwardRef((props, ref) => {
    const { as, meta, nodes, icons, onSelect, treeTag, selected, ...rest } = props;
    const { tag, label, icon, under, isHead } = meta;
    const [isOpen, setIsOpen] = useState(tag == `root`);
    const toggle = () => {
        localStorage.setItem(`--tn${treeTag}-${tag}`, isOpen ? `0` : `1`);
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        if (tag == `root` && !localStorage.getItem(`--tn${treeTag}-${tag}`)) {
            localStorage.setItem(`--tn${treeTag}-${tag}`, `1`);
            setIsOpen(true);
        }
        else
            setIsOpen(localStorage.getItem(`--tn${treeTag}-${tag}`) == `1`);
    }, []);
    const _nodes = nodes.filter(x => x.under == tag);
    return _jsxs(Box, { className: `--treenode --treenode-${tag} flex cols`, children: [_jsxs(Box, { className: `--node --node-${tag} flex aic${selected == tag ? ` --selected` : ``}`, children: [_jsx(Button, { skeleton: rest.skeleton, onClick: toggle, className: `--node-aro-btn`, disabled: _nodes.length == 0, children: icons ? _jsx(Icon, { skeleton: rest.skeleton, className: `--node-aro-icon`, name: _nodes.length == 0 ? icons?.arrowDisabled || icons?.arrowClose : isOpen ? icons?.arrowOpen : icons?.arrowClose })
                            : _nodes.length == 0 ? SVGIcons.chevronBottom : isOpen ? SVGIcons.chevronBottom : SVGIcons.chevronRight }), _jsxs(Button, { className: `--node-meta flex aic`, onClick: (e) => onSelect(tag), children: [icons?.nodeOpen && icons?.nodeClose && _jsx(Icon, { skeleton: rest.skeleton, className: `--node-icon`, name: icon || (isOpen ? icons?.nodeOpen : icons?.nodeClose) }), _jsx(Text, { ...{ className: `--node-label` }, skeleton: rest.skeleton, children: label })] })] }), isOpen && _nodes.length > 0 && _jsx(Box, { className: `--sub-node tree-sub-node-${tag} flex cols`, children: _nodes.map(node => _jsx(TreeItem, { treeTag: treeTag, selected: selected, onSelect: onSelect, icons: icons, meta: node, nodes: nodes }, `--node-${node.tag}`)) })] });
});
export default TreeItem;
