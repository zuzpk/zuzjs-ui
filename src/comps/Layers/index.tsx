import { createContext, FC, ReactNode, Ref, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LayerItem, LayersContextType, LayersController, LayerType } from "./types";
import Box from "../Box";
import Dialog from "../Dialog";
import { DialogProps } from "../Dialog/types";
import Toast from "../Toast";
import { ToastProps } from "../Toast/types";
import { createPortal } from "react-dom";
import { useDelayed } from "@zuzjs/hooks";
import Drawer from "../Drawer";
import { DrawerProps } from "../Drawer/types";
import ContextMenu from "../ContextMenu";
import { ContextMenuProps } from "../ContextMenu/types";

export const LayersContext = createContext<LayersContextType | null>(null);

const LayersRenderer = ({
    ref,
    ...props
} : {
    ref: Ref<LayersController>
}) => {

    const parentContext = useContext(LayersContext);
    const depth = useRef(0);

    const [activeMenu, setActiveMenu] = useState<LayerItem | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [layers, setLayers] = useState<LayerItem[]>([]);
    const mounted = useDelayed()
    const id = useRef(0)
    const nextId = () => ++id.current;

    useEffect(() => {
        let current = parentContext;
        while (current?.isSubLayer) {
            depth.current++;
        }
    }, [parentContext]);

    const closeMenu = () => {
        setMenuVisible(false); // Trigger exit animation
        setTimeout(() => setActiveMenu(null), 200); // Actually unmount after FX
    };

    useImperativeHandle(ref, () => ({
        add(layer: Omit<LayerItem, 'id'>) {
            const layerId = nextId();
            const fullLayer: LayerItem = { id: layerId, ...layer };
            setLayers(prev => [fullLayer, ...prev.slice(0, 20)]);

            return layerId

        },
        openMenu(props) {
            setMenuVisible(false);
            setTimeout(() => {
                setActiveMenu({ id: nextId(), type: "menu", props });
                setMenuVisible(true);
            }, 16);
        },
        remove(id: number) {
            setLayers(t => t.filter(layer => layer.id !== id));
            if (activeMenu?.id === id) closeMenu();
        },
        clear(){
            setLayers([])
        }
    }))

    useEffect(() => {
        if (activeMenu && menuVisible) {
            // Use capture phase or timeout to avoid closing instantly on the click that opens it
            const handleGlobal = () => closeMenu();
            document.addEventListener("click", handleGlobal);
            return () => document.removeEventListener("click", handleGlobal);
        }
    }, [activeMenu, menuVisible, closeMenu]);

    const onClose = (di: number) => {
        setTimeout(() => {
            setLayers(t => t.filter(layer => layer.id !== di))
            if (activeMenu?.id === di) setActiveMenu(null);
        }, 1000)
    }

    if ( !mounted ) return null

    const dialogs = layers.filter(l => l.type == `dialog`)
    const drawers = layers.filter(l => l.type == `drawer`)
    const toasts = layers.filter(l => l.type == `toast`)
            
    return createPortal(<Box as={`--zuz-layers-wrapper fixed fill nope`} style={{ zIndex: 9999 + depth.current }}>

        {/* Dialogs */}
        {dialogs.length > 0 && <Box as={`--zuz-layer-dialogs fixed fill nope`}>
            {dialogs.map((layer, i) => <Dialog 
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as DialogProps} />)}
        </Box>}

        {/* Drawers */}
        {drawers.length > 0 && <Box as={`--zuz-layer-drawers fixed fill nope`}>
            {drawers.map((layer, i) => <Drawer
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as DrawerProps} />)}
        </Box>}
        
        {/* Toasts */}
        {toasts.length > 0 && <Box as={`--zuz-layer-toasts fixed fill nope`}>
            {toasts.map((layer, i) => <Toast
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as ToastProps} />)}
        </Box>}

        {/* Context Menu / Dropdown Zone */}
        {activeMenu && <Box as={`--zuz-layer-menus fixed fill nope`}>
            <ContextMenu
                key={`menu-${activeMenu.id}`}
                onClose={closeMenu}
                when={menuVisible}
                {...(activeMenu.props as ContextMenuProps)}
            />
        </Box>}

    </Box>,
    document.body)

}

const LayersProvider : FC<{
    children: ReactNode
}> = ({
    children
}) => {

    const parentContext = useContext(LayersContext);
    const currentDepth = (parentContext?.depth ?? 0) + (parentContext ? 1 : 0);

    const LayersController = useRef<LayersController>(null)

    const contextValue = useMemo(() => ({ 
        add:  (layer: Omit<LayerItem, 'id'>) : number => {
            return LayersController.current?.add(layer)!
        }, 
        openMenu: (props: ContextMenuProps) => LayersController.current?.openMenu(props)!,
        remove: (id: number) => LayersController.current?.remove(id)!, 
        clear: () => LayersController.current?.clear()!, 
        depth: currentDepth,
        isSubLayer: !!parentContext,
    }), [LayersController.current, parentContext]);

    return <LayersContext.Provider value={contextValue}>
        {children}
        <LayersRenderer ref={LayersController} />
    </LayersContext.Provider>
}

export default LayersProvider