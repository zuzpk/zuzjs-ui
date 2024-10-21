import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react";
import With from "../base";
import { TreeNode, TreeNodeIcons } from ".";
import { BaseProps } from "../../types/interfaces";

export interface TreeItemProps {
    treeTag: string,
    meta: TreeNode,
    nodes: TreeNode[],
    onSelect: (tag : string) => void,
    selected?: String,
    icons?: TreeNodeIcons
}

export interface TreeItemHandler {
    onSelect?: (v : TreeNode) => void
}


const TreeItem = forwardRef<TreeItemHandler, TreeItemProps & BaseProps>((props, ref) => {

    const { as, meta, nodes, icons, onSelect, treeTag, selected, ...rest } = props
    const { tag, label, under } = meta
    
    const [isOpen, setIsOpen] = useState( tag == `root` );

    const toggle = () => {
        localStorage.setItem(`--tn${treeTag}-${tag}`, isOpen ? `0` : `1`)
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if ( tag == `root` && !localStorage.getItem(`--tn${treeTag}-${tag}`) ){
            localStorage.setItem(`--tn${treeTag}-${tag}`, `1`)
            setIsOpen(true)
        }
        else
            setIsOpen(localStorage.getItem(`--tn${treeTag}-${tag}`) == `1`)
    }, [])

    const _nodes = nodes.filter(x => x.under == tag)

    return <With as={`tree-node tree-node-${tag} flex cols`}>

        <With as={`--node --node-${tag} flex aic${selected == tag ? ` --selected` : ``}`}>
            <With tag={`button`} onClick={toggle} className={`--node-aro-btn`}>
                <With className={`--node-aro-icon icon-${isOpen ? icons?.arrowOpen : icons?.arrowClose}`} />
            </With>
            <With tag={`button`} className={`--node-meta flex aic`} onClick={(e: MouseEvent) => onSelect(tag)}>
                <With className={`--node-icon icon-${isOpen ? icons?.dirOpen : icons?.dirClose}`} />
                <With tag={`h1`} className={`--node-label`}>{label}</With>
            </With>
        </With>

        {isOpen && _nodes.length > 0 && <With className={`--sub-node tree-sub-node-${tag} flex cols`}>
            {_nodes.map(node =>  <TreeItem 
                treeTag={treeTag}
                selected={selected} 
                onSelect={onSelect}
                icons={icons} 
                key={`tree-node-${node.tag}`} 
                meta={node} 
                nodes={nodes} />)}</With>}

    </With>

})

export default TreeItem