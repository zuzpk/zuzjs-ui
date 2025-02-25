import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { TreeItemProps, TreeViewHandler, TreeViewProps } from "./types";
import Box, { BoxProps } from "../Box";
import TreeItem from "./item";


const TreeView = forwardRef<TreeViewHandler, TreeViewProps>((props, ref) => {

    const { as, nodes, onNodeSelect, tag: treeViewTag, icons, roots, selected: _selected, ...rest } = props
    const [ selected, setSelected ] = useState<string>(_selected!)

    useImperativeHandle(ref, () => ({ 
        getSelected: () => selected
    }), [onNodeSelect])

    const handleSelect = (tag: string) => {
        setSelected(tag)
        onNodeSelect && onNodeSelect(tag)
    }

    useEffect(() => {
        if(selected != _selected){
            setSelected(_selected!)
        }
    }, [_selected])

    return <Box className={`--treeview flex cols`}>
        {nodes
            .filter(node => roots.includes(node.tag))
            .map(node => <TreeItem
                key={`--node-${node.tag}`}
                treeTag={treeViewTag ? `-${treeViewTag}` : ``}
                selected={selected}
                onSelect={e => handleSelect(e as string)}
                icons={icons}
                meta={node}
                nodes={nodes} />)}
    </Box>

})

export default TreeView