import { DialogProps } from "../Dialog/types";
import { DrawerProps } from "../Drawer/types";
import { ToastProps } from "../Toast/types";

export type LayerType = "dialog" | "drawer" | "toast"

export type LayerItem = {
    id: number,
    type: LayerType,
    props: DialogProps | DrawerProps | ToastProps
}

export interface LayersController {
  add: (layer: Omit<LayerItem, 'id'>) => number;
  remove: (id: number) => void;
  clear: () => void;
}

export interface LayersContextType extends LayersController {

}