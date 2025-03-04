import { TreeViewHandler } from "./types";
declare const TreeView: import("react").ForwardRefExoticComponent<Omit<import("..").BoxProps, "tag"> & {
    tag?: string;
    roots: string[];
    nodes: import("./types").TreeNode[];
    onNodeSelect: (tag: string) => void;
    icons?: import("./types").TreeNodeIcons;
    selected?: string;
} & import("react").RefAttributes<TreeViewHandler>>;
export default TreeView;
