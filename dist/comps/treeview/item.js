import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useState } from "react";
import With from "../base";
const TreeItem = forwardRef((props, ref) => {
    const { as, meta, nodes, icons, onSelect, treeTag, selected, ...rest } = props;
    const { tag, label, under } = meta;
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
    return _jsxs(With, { as: `tree-node tree-node-${tag} flex cols`, children: [_jsxs(With, { as: `--node --node-${tag} flex aic${selected == tag ? ` --selected` : ``}`, children: [_jsx(With, { tag: `button`, onClick: toggle, className: `--node-aro-btn`, children: _jsx(With, { className: `--node-aro-icon icon-${isOpen ? icons?.arrowOpen : icons?.arrowClose}` }) }), _jsxs(With, { tag: `button`, className: `--node-meta flex aic`, onClick: (e) => onSelect(tag), children: [_jsx(With, { className: `--node-icon icon-${isOpen ? icons?.dirOpen : icons?.dirClose}` }), _jsx(With, { tag: `h1`, className: `--node-label`, children: label })] })] }), isOpen && _nodes.length > 0 && _jsx(With, { className: `--sub-node tree-sub-node-${tag} flex cols`, children: _nodes.map(node => _jsx(TreeItem, { treeTag: treeTag, selected: selected, onSelect: onSelect, icons: icons, meta: node, nodes: nodes }, `tree-node-${node.tag}`)) })] });
});
export default TreeItem;
