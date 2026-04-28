import { ReactNode, useContext } from "react";
import { LayersContext } from "../comps/Layers";

const useColorPicker = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useColorPicker must be used inside <LayersProvider>');

    const show = (node: ReactNode): number => {
        return ctx.add({
            type: `colorpicker`,
            props: { node }
        });
    };

    const update = (id: number, node: ReactNode) => {
        ctx.update(id, { node });
    };

    const hide = (id: number) => {
        ctx.remove(id);
    };

    const clearAll = () => {
        ctx.clear(`colorpicker`);
    };

    return {
        show,
        update,
        hide,
        clearAll,
    };
};

export default useColorPicker;
