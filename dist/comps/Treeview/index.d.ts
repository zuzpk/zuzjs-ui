import { TreeViewHandler } from "./types";
import { BoxProps } from "../Box";
declare const TreeView: import("react").ForwardRefExoticComponent<Omit<BoxProps, "tag"> & {
    tag?: string;
    roots: string[];
    nodes: import("./types").TreeNode[];
    onSelect: (tag: string) => void;
    icons?: import("./types").TreeNodeIcons;
    selected?: string;
} & import("react").RefAttributes<TreeViewHandler>>;
export default TreeView;
