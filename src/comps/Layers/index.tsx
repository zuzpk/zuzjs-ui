import { createContext, FC, ReactNode, Ref, useImperativeHandle, useMemo, useRef, useState } from "react";
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

export const LayersContext = createContext<LayersContextType | null>(null);

const LayersRenderer = ({
    ref,
    ...props
} : {
    ref: Ref<LayersController>
}) => {

    const [layers, setLayers] = useState<LayerItem[]>([]);
    const mounted = useDelayed()
    const id = useRef(0)
    const nextId = () => ++id.current;

    useImperativeHandle(ref, () => ({
        add(layer: Omit<LayerItem, 'id'>) {
            const layerId = nextId();
            const fullLayer: LayerItem = { id: layerId, ...layer };
            setLayers(prev => [fullLayer, ...prev.slice(0, 20)]);

            return layerId

        },
        remove(id: number) {
            setLayers(t => t.filter(layer => layer.id !== id));
        },
        clear(){
            setLayers([])
        }
    }))

    if ( !mounted ) return null

    const onClose = (di: number) => {
        console.log(layers, di)
        setTimeout(() => setLayers(t => t.filter(layer => layer.id !== di)), 1000)
    }

    return createPortal(<Box as={`--zuz-layers-wrapper fixed fill nope`}>

        {/* Dialogs */}
        <Box as={`--zuz-layer-dialogs fixed fill nope`}>
            {layers
            .filter(l => l.type == `dialog`)
            .map((layer, i) => <Dialog 
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as DialogProps} />)}
        </Box>

        {/* Drawers */}
        <Box as={`--zuz-layer-drawers fixed fill nope`}>
            {layers
            .filter(l => l.type == `drawer`)
            .map((layer, i) => <Drawer
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as DrawerProps} />)}
        </Box>
        
        {/* Toasts */}
        <Box as={`--zuz-layer-toasts fixed fill nope`}>
            {layers
            .filter(l => l.type == `toast`)
            .map((layer, i) => <Toast
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as ToastProps} />)}
        </Box>
    </Box>,
    document.body)

}

const LayersProvider : FC<{
    children: ReactNode
}> = ({
    children
}) => {

    const LayersController = useRef<LayersController>(null)

    const contextValue = useMemo(() => ({ 
        add:  (layer: Omit<LayerItem, 'id'>) : number => {
            return LayersController.current?.add(layer)!
        }, 
        remove: (id: number) => LayersController.current?.remove(id)!, 
        clear: () => LayersController.current?.clear()!, 
    }), [LayersController.current]);

    return <LayersContext.Provider value={contextValue}>
        {children}
        <LayersRenderer ref={LayersController} />
    </LayersContext.Provider>
}

export default LayersProvider