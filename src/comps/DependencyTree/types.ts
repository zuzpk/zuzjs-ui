import { dynamic } from "@zuzjs/core";
import { ReactNode } from "react";

export interface DependencyTreeNode {
  id: string;
  label?: string;
  meta?: dynamic;
  status: 'root' | 'merged' | 'active' | 'blocked';
  level?: number;
  color?: string;
  lineColor?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  cardColor?: string;
  textColor?: string;
}

export interface DependencyTreeRenderContext {
  isCurrent: boolean;
  mode: 'list' | 'pyramid';
  variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge: boolean;
  index: number;
  rowIndex?: number;
}

export type DependencyTreeRenderNode = (
  node: DependencyTreeNode,
  context: DependencyTreeRenderContext
) => ReactNode;

export interface DependencyTreeProps {
  currentId?: string;
  nodes: DependencyTreeNode[];
  mode?: 'list' | 'pyramid';
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  renderNode?: DependencyTreeRenderNode;
}