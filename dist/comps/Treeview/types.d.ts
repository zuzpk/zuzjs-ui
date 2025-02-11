import { ReactNode } from "react";
import { BoxProps } from "../Box";
export interface TreeNodeIcons {
    dirOpen: ReactNode;
    dirClose: ReactNode;
    arrowOpen: ReactNode;
    arrowClose: ReactNode;
}
export type TreeViewProps = Omit<BoxProps, `tag`> & {
    tag?: string;
    roots: string[];
    nodes: TreeNode[];
    onSelect: (tag: string) => void;
    icons?: TreeNodeIcons;
    selected?: string;
};
export interface TreeViewHandler {
    getSelected?: () => String;
}
export interface TreeNode {
    tag: string;
    label: string;
    icon?: ReactNode;
    under?: string;
    selected?: string;
    expanded?: boolean;
}
export type TreeItemProps = BoxProps & {
    treeTag: string;
    meta: TreeNode;
    nodes: TreeNode[];
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: TreeNodeIcons;
};
export interface TreeItemHandler {
    onSelect?: (v: TreeNode) => void;
}
