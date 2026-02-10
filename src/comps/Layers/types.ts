import { ContextMenuProps } from "../ContextMenu/types";
import { DialogProps } from "../Dialog/types";
import { DrawerProps } from "../Drawer/types";
import { ToastProps } from "../Toast/types";

export type LayerType = "dialog" | "drawer" | "toast" | "menu"

export type LayerItem = {
    id: number,
    type: LayerType,
    props: DialogProps | DrawerProps | ToastProps | ContextMenuProps
}

export interface LayersController {
  add: (layer: Omit<LayerItem, 'id'>) => number;
  openMenu: (props: ContextMenuProps) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export interface LayersContextType extends LayersController {

}