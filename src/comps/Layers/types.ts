import { ReactNode } from "react";
import { ContextMenuProps } from "../ContextMenu/types";
import { DialogProps } from "../Dialog/types";
import { DrawerProps } from "../Drawer/types";
import { ToastProps } from "../Toast/types";

export type LayerType = "dialog" | "drawer" | "toast" | "menu" | "colorpicker"

export type ColorPickerLayerProps = {
  node: ReactNode;
}

export type LayerItem = {
  id: number,
  type: LayerType,
  props: DialogProps | DrawerProps | ToastProps | ContextMenuProps | ColorPickerLayerProps
}

export interface LayersController {
  add: (layer: Omit<LayerItem, 'id'>) => number;
  openMenu: (props: ContextMenuProps) => void;
  update: (id: number, props: Partial<LayerItem['props']>) => void;
  remove: (id: number) => void;
  loading: (id: number, mode: boolean) => void;
  clear: (type: LayerType) => void;
}

export interface LayersContextType extends LayersController {
  depth: number;
  isSubLayer: boolean;
}