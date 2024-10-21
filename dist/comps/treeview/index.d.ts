import { ReactNode } from "react";
import { BaseProps } from "../../types/interfaces";
export interface TreeNodeIcons {
    dirOpen: ReactNode;
    dirClose: ReactNode;
    arrowOpen: ReactNode;
    arrowClose: ReactNode;
}
export interface TreeViewProps {
    tag?: string;
    roots: string[];
    nodes: TreeNode[];
    onSelect: (tag: string) => void;
    icons?: TreeNodeIcons;
    selected?: string;
}
export interface TreeViewHandler {
    getSelected?: () => String;
}
export interface TreeNode {
    tag: string;
    label: string;
    under?: string;
    selected?: string;
    expanded?: boolean;
}
declare const TreeView: import("react").ForwardRefExoticComponent<TreeViewProps & BaseProps & import("react").RefAttributes<TreeViewHandler>>;
export default TreeView;
