import { ReactNode } from "react"
import { BoxProps } from "../Box"

export interface TreeNodeIcons {
    rootOpen?: ReactNode,
    rootClose?: ReactNode,
    nodeOpen?: ReactNode,
    nodeClose?: ReactNode,
    arrowOpen?: ReactNode,
    arrowClose?: ReactNode,
    arrowDisabled?: ReactNode
}

export type TreeViewProps = Omit<BoxProps, `tag`> & {
    tag?: string,
    roots: string[],
    nodes: TreeNode[],
    onNodeSelect: (tag : string) => void,
    icons?: TreeNodeIcons,
    selected?: string
}

export interface TreeViewHandler {
    getSelected?: () => String
}

export interface TreeNode {
    tag: string,
    label: string,
    icon?: ReactNode,
    under?: string,
    selected?: string,
    expanded?: boolean,
    isHead?: boolean,
}

export type TreeItemProps = BoxProps & {
    treeTag: string,
    meta: TreeNode,
    nodes: TreeNode[],
    expanded: boolean,
    roots: string[],
    onSelect: (tag : string) => void,
    selected?: String,
    icons?: TreeNodeIcons
}

export interface TreeItemHandler {
    onSelect?: (v : TreeNode) => void
}