import { TreeItemHandler } from "./types";
declare const TreeItem: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
    treeTag: string;
    meta: import("./types").TreeNode;
    nodes: import("./types").TreeNode[];
    expanded: boolean;
    roots: string[];
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: import("./types").TreeNodeIcons;
} & import("react").RefAttributes<TreeItemHandler>>;
export default TreeItem;
