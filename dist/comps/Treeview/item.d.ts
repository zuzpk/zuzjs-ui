import { TreeItemHandler } from "./types";
import { BoxProps } from "../Box";
declare const TreeItem: import("react").ForwardRefExoticComponent<BoxProps & {
    treeTag: string;
    meta: import("./types").TreeNode;
    nodes: import("./types").TreeNode[];
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: import("./types").TreeNodeIcons;
} & import("react").RefAttributes<TreeItemHandler>>;
export default TreeItem;
