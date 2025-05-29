"use client"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box from "../Box";
import TreeItem from "./item";
import { TreeViewHandler, TreeViewProps } from "./types";


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
                roots={roots}
                expanded={node.expanded || false}
                skeleton={rest.skeleton}
                nodes={nodes} />)}
    </Box>

})

TreeView.displayName = `Zuz.TreeView`

export default TreeView