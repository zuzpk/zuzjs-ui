import { useDelayed } from "@zuzjs/hooks";
import { createContext, FC, ReactNode, Ref, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Box from "../Box";
import ContextMenu from "../ContextMenu";
import { ContextMenuProps } from "../ContextMenu/types";
import Dialog from "../Dialog";
import { DialogProps } from "../Dialog/types";
import Drawer from "../Drawer";
import { DrawerProps } from "../Drawer/types";
import Toast from "../Toast";
import { ToastPosition, ToastProps } from "../Toast/types";
import { ColorPickerLayerProps, LayerItem, LayersContextType, LayersController, LayerType } from "./types";

export const LayersContext = createContext<LayersContextType | null>(null);

const LayersRenderer = ({
    ref,
    ...props
} : {
    ref: Ref<LayersController>
}) => {

    const parentContext = useContext(LayersContext);
    const depth = parentContext?.depth ?? 0;

    const [hoveredPos, setHoveredPos] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<LayerItem | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [layers, setLayers] = useState<LayerItem[]>([]);
    const mounted = useDelayed()
    const id = useRef(0)
    const nextId = () => ++id.current;

    const closeMenu = () => {
        setMenuVisible(false); // Trigger exit animation
        setTimeout(() => setActiveMenu(null), 200); // Actually unmount after FX
    };

    useImperativeHandle(ref, () => ({
        add(layer: Omit<LayerItem, 'id'>) {
            // Opening a new foreground layer should dismiss any active menu.
            if (activeMenu && layer.type !== `toast`) {
                closeMenu();
            }
            const layerId = nextId();
            const fullLayer: LayerItem = { id: layerId, ...layer };
            setLayers(prev => [ ...prev, fullLayer ]);
            return layerId
        },
        openMenu(props) {
            setMenuVisible(false);
            setTimeout(() => {
                setActiveMenu({ id: nextId(), type: "menu", props });
                setMenuVisible(true);
            }, 16);
        },
        update(id: number, props: Partial<LayerItem['props']>) {
            setLayers(prev => prev.map(l => {
                if (l.id !== id) return l;
                return {
                    ...l,
                    props: {
                        ...(l.props as Record<string, unknown>),
                        ...(props as Record<string, unknown>)
                    }
                } as LayerItem;
            }));
        },
        remove(id: number) {
            setLayers(prev => {
                const target = prev.find(layer => layer.id === id);
                if (!target) return prev;

                // Dialog/Drawer/Toast have close animations driven by forceClose.
                if (target.type === `dialog` || target.type === `drawer` || target.type === `toast`) {
                    return prev.map(l => l.id === id ? { ...l, props: { ...l.props, forceClose: true } } : l);
                }

                return prev.filter(layer => layer.id !== id);
            });
            if (activeMenu?.id === id) closeMenu();
        },
        loading(id: number, mode: boolean) {
            // setLayers(t => t.filter(layer => layer.id !== id));
            setLayers(prev => prev.map(l => l.id === id ? { ...l, props: { ...l.props, forceLoading: mode } } : l));
            if (activeMenu?.id === id) closeMenu();
        },
        clear(type: LayerType){
            setLayers(layers.filter(l => l.type != type))
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
        }, 250)
    }

    const sortedLayers = useMemo(() => [...layers.filter(l => l.type != `toast`)], [layers]); // Newest is at the end
    
    if ( !mounted ) return null

    // const dialogs = layers.filter(l => l.type == `dialog`).reverse()
    // const drawers = layers.filter(l => l.type == `drawer`).reverse()
    const toasts = layers.filter(l => l.type == `toast`).reverse()
    const positions = Object.values(ToastPosition);
            
    return createPortal(<Box as={`--zuz-layers-wrapper fixed fill nope`} style={{ zIndex: 9999 + depth }}>

        {/* Unified Stack: Order depends on when they were opened */}
        {sortedLayers.map((layer, i) => {

            const inBackground = i < sortedLayers.length - 1;

            if (layer.type === 'dialog') {
                return <Dialog 
                    onClose={onClose}
                    key={`layer-${layer.type}-${layer.id}`} 
                    index={i} 
                    {...{ id: layer.id, ...layer.props, inBackground } as DialogProps} />
            }
            if (layer.type === 'drawer') {
                return <Drawer
                    onClose={onClose}
                    key={`layer-${layer.type}-${layer.id}`} 
                    index={i} 
                    {...{ id: layer.id, ...layer.props, inBackground } as DrawerProps} />
            }
            if (layer.type === 'colorpicker') {
                return <Box as={`--zuz-layer-colorpicker`} key={`layer-${layer.type}-${layer.id}`}>
                    {(layer.props as ColorPickerLayerProps).node}
                </Box>
            }

            return null

        })}
            
        {positions.map(pos => {
            const posToasts = toasts.filter(t => ((t.props as ToastProps).position || ToastPosition.TopCenter) === pos);
            if (posToasts.length === 0) return null;

            return <Box 
                key={pos}
                onMouseEnter={() => setHoveredPos(pos)}
                onMouseLeave={() => setHoveredPos(null)}
                as={`--toast-container fixed --${pos.toLowerCase()} flex cols`}
                style={{ pointerEvents: 'auto', zIndex: `var(--max-z-index)` }}>
                    {posToasts.map((layer, i) => (
                        <Toast
                            key={layer.id}
                            index={i}
                            total={posToasts.length}
                            isHovered={hoveredPos === pos}
                            onClose={onClose}
                            {...{ id: layer.id, ...layer.props } as ToastProps}
                        />
                    ))}
                </Box>
            

        })}

        {/* {toasts.length > 0 && <Box as={`--zuz-layer-toasts fixed fill nope`} style={{ zIndex: `var(--max-z-index)` }}>
            {toasts.map((layer, i) => <Toast
                onClose={onClose}
                key={`layer-${layer.type}-${layer.id}`} 
                index={i} 
                {...{ id: layer.id, ...layer.props } as ToastProps} />)}
        </Box>} */}

        {/* Context Menu / Dropdown Zone */}
        {activeMenu && <Box as={`--zuz-layer-menus fixed fill nope`} style={{ zIndex: `var(--max-z-index)` }}>
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

/**
 * Layers component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Layers>Content with layering</Layers>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Layers zIndex={10} opacity={0.9}>Stacked content</Layers>
 * ```
 * @param zIndex - Z-index stacking order
 * @param opacity - Opacity level (0-1)
 */
const LayersProvider : FC<{
    children: ReactNode
}> = ({
    children
}) => {

    const parentContext = useContext(LayersContext);
    const currentDepth = parentContext ? parentContext.depth + 1 : 0

    const LayersController = useRef<LayersController>(null)

    const contextValue = useMemo(() => ({ 
        add:  (layer: Omit<LayerItem, 'id'>) : number => {
            return LayersController.current?.add(layer)!
        }, 
        openMenu: (props: ContextMenuProps) => LayersController.current?.openMenu(props)!,
        update: (id: number, props: Partial<LayerItem['props']>) => LayersController.current?.update(id, props)!,
        remove: (id: number) => LayersController.current?.remove(id)!, 
        loading: (id: number, mode: boolean) => LayersController.current?.loading(id, mode)!, 
        clear: (type: LayerType) => LayersController.current?.clear(type)!, 
        depth: currentDepth,
        isSubLayer: !!parentContext,
    }), [parentContext]);

    return <LayersContext.Provider value={contextValue}>
        {children}
        <LayersRenderer ref={LayersController} />
    </LayersContext.Provider>
}

export default LayersProvider