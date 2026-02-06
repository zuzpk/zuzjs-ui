import { createContext, FC, forwardRef, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import { DialogContextType, DialogController, DialogProps } from "./types";
import { SHEET, TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import { ValueOf } from "../../types";
import Dialog from "./dialog";

export const DialogContext = createContext<DialogContextType | null>(null);

const DialogRenderer = forwardRef<DialogController>((props, ref) => {

    const [dialogs, setDialogs] = useState<DialogProps[]>([]);
    
    const id = useRef(0)
    const nextId = () => ++id.current;

    useImperativeHandle(ref, () => ({
        add(sheet: Omit<DialogProps, 'id'>) {

            const dialogId = nextId();
            const fullDialog: DialogProps = { id: dialogId, ...sheet };
            
            setDialogs(prev => [fullDialog, ...prev.slice(0, 4)]); // max 5

            return dialogId

        },
        remove(id: number) {
            setDialogs(t => t.filter(sheet => sheet.id !== id));
        },
        clear(){
            setDialogs([])
        }
    }))

    const onDialogClose = (di: number) => {
        setTimeout(() => setDialogs(t => t.filter(sheet => sheet.id !== di)), 1000)
    }

    return <Box as={`--dialog-wrapper rel`}>
        {dialogs.map((d, i) => <Dialog 
            onClose={onDialogClose}
            key={`sheet-${d.id}`} index={i} {...d} />)}
    </Box>
})

const SheetProvider: FC<{ 
    children: ReactNode,
    fx?: {
        curve: ValueOf<typeof TRANSITION_CURVES>,
        duration: number
    }
}> = forwardRef(({ children, fx }, ref) => {

    const DialogController = useRef<DialogController>(null)

    const contextValue = useMemo(() => ({ 
        add:  (sheet: Omit<DialogProps, 'id'>) : number => DialogController.current?.add(sheet)!, 
        remove: (id: number) => DialogController.current?.remove(id)!, 
        clear: () => DialogController.current?.clear()!, 
        fx: fx || {
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.4
        }
    }), [DialogController.current]);

    return <DialogContext.Provider value={contextValue}>
        { children }
        <DialogRenderer ref={DialogController} />
    </DialogContext.Provider>

})

export default SheetProvider