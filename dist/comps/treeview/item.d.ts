import { TreeNode, TreeNodeIcons } from ".";
import { BaseProps } from "../../types/interfaces";
export interface TreeItemProps {
    treeTag: string;
    meta: TreeNode;
    nodes: TreeNode[];
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: TreeNodeIcons;
}
export interface TreeItemHandler {
    onSelect?: (v: TreeNode) => void;
}
declare const TreeItem: import("react").ForwardRefExoticComponent<TreeItemProps & BaseProps & import("react").RefAttributes<TreeItemHandler>>;
export default TreeItem;
