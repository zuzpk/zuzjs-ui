import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box from "../Box";
import TreeItem from "./item";
const TreeView = forwardRef((props, ref) => {
    const { as, nodes, onNodeSelect, tag: treeViewTag, icons, roots, selected: _selected, ...rest } = props;
    const [selected, setSelected] = useState(_selected);
    useImperativeHandle(ref, () => ({
        getSelected: () => selected
    }), [onNodeSelect]);
    const handleSelect = (tag) => {
        setSelected(tag);
        onNodeSelect && onNodeSelect(tag);
    };
    useEffect(() => {
        if (selected != _selected) {
            setSelected(_selected);
        }
    }, [_selected]);
    return _jsx(Box, { className: `--treeview flex cols`, children: nodes
            .filter(node => roots.includes(node.tag))
            .map(node => _jsx(TreeItem, { treeTag: treeViewTag ? `-${treeViewTag}` : ``, selected: selected, onSelect: e => handleSelect(e), icons: icons, meta: node, skeleton: rest.skeleton, nodes: nodes }, `--node-${node.tag}`)) });
});
export default TreeView;
