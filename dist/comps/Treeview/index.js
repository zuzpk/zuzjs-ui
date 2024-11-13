import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box from "../Box";
import TreeItem from "./item";
const TreeView = forwardRef((props, ref) => {
    const { as, nodes, onSelect, tag: treeViewTag, icons, roots, selected: _selected, ...rest } = props;
    const [selected, setSelected] = useState(_selected);
    useImperativeHandle(ref, () => ({
        getSelected: () => selected
    }), [onSelect]);
    const handleSelect = (tag) => {
        setSelected(tag);
        onSelect && onSelect(tag);
    };
    useEffect(() => {
        if (selected != _selected) {
            setSelected(_selected);
        }
    }, [_selected]);
    return _jsx(Box, { className: `--treeview flex cols`, children: nodes
            .filter(node => roots.includes(node.tag))
            .map(node => _jsx(TreeItem, { treeTag: treeViewTag ? `-${treeViewTag}` : ``, selected: selected, onSelect: e => handleSelect(e), icons: icons, meta: node, nodes: nodes }, `--node-${node.tag}`)) });
});
export default TreeView;
