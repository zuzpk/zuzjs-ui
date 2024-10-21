import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { dynamicObject } from "../../types";
import { BaseProps } from "../../types/interfaces";
import With from "../base";
import TreeItem from "./item";

export interface TreeNodeIcons {
    dirOpen: ReactNode,
    dirClose: ReactNode,
    arrowOpen: ReactNode,
    arrowClose: ReactNode
}

export interface TreeViewProps {
    tag?: string,
    roots: string[],
    nodes: TreeNode[],
    onSelect: (tag : string) => void,
    icons?: TreeNodeIcons,
    selected?: string
}

export interface TreeViewHandler {
    getSelected?: () => String
}

export interface TreeNode {
    tag: string,
    label: string,
    under?: string,
    selected?: string,
    expanded?: boolean,
}

const TreeView = forwardRef<TreeViewHandler, TreeViewProps & BaseProps>((props, ref) => {

    const { as, nodes, onSelect, tag: treeViewTag, icons, roots, selected: _selected, ...rest } = props
    const [ selected, setSelected ] = useState<string>(_selected!)

    useImperativeHandle(ref, () => ({ 
        getSelected: () => selected
    }), [onSelect])

    const handleSelect = (tag: string) => {
        setSelected(tag)
        onSelect && onSelect(tag)
    }

    useEffect(() => {
        if(selected != _selected){
            setSelected(_selected!)
        }
    }, [_selected])

    return <With className={`treeview flex cols`}>
        {nodes
            .filter(node => roots.includes(node.tag))
            .map(node => <TreeItem 
                treeTag={treeViewTag ? `-${treeViewTag}` : ``}
                selected={selected} 
                onSelect={handleSelect}
                icons={icons} 
                key={`tree-node-${node.tag}`} 
                meta={node} 
                nodes={nodes} />)}
    </With>

})

export default TreeView