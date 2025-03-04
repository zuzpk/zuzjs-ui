import { TreeItemHandler } from "./types";
declare const TreeItem: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
    treeTag: string;
    meta: import("./types").TreeNode;
    nodes: import("./types").TreeNode[];
    isRoot: boolean;
    expanded: boolean;
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: import("./types").TreeNodeIcons;
} & import("react").RefAttributes<TreeItemHandler>>;
export default TreeItem;
