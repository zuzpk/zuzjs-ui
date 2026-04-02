"use client"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box from "../Box";
import TreeItem from "./item";
import { TreeViewHandler, TreeViewProps } from "./types";


/**
 * TreeView component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Treeview roots={["root"]} nodes={[{ tag: "root", label: "Root", isHead: true }]} onNodeSelect={(tag) => console.log(tag)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Treeview roots={["root"]} nodes={[{ tag: "root", label: "Root", isHead: true, expanded: true }, { tag: "child", label: "Child", under: "root" }]} selected="root" onNodeSelect={(tag) => console.log(tag)} />
 * ```
 * @param roots - Root node identifiers
 * @param nodes - Tree node definitions
 * @param onNodeSelect - Callback function triggered on node selection
 * @param selected - Currently selected item/date
 */
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