import { ReactNode } from "react";
import { BoxProps, LayerHandler, Placement, ValueOf } from "../../types";
import { DRAWER_SIDE, TRANSITION_CURVES } from "../../types/enums";

export type DrawerConfirmOptions = {
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
}

/** Pass `true` for default confirm text, or an options object to customise the dialog. */
export type DrawerConfirmClose = boolean | DrawerConfirmOptions

export type DrawerContextType = {
    /** Mark the drawer as having unsaved changes. */
    setDirty: (dirty: boolean) => void
    isDirty: boolean
}

export type DrawerProps = Omit<BoxProps, `id`> & {
    id?: number,
    index?: number,
    as?: string,
    speed?: number,
    from?: ValueOf<typeof DRAWER_SIDE>,
    children?: string | ReactNode | ReactNode[],
    prerender?: boolean,
    margin?: number,
    animation?: ValueOf<typeof TRANSITION_CURVES>,
    closeBtn?: Extract<Placement, "left" | "right">,
    onClose?: (id: number) => void,
    /** When truthy, overlay / ESC close is gated by a "Discard changes?" confirm when dirty. */
    confirmClose?: DrawerConfirmClose,
    /** Externally controlled dirty state (synced to internal dirty state). */
    dirty?: boolean,
    /** @internal Injected by LayersRenderer to open the confirm dialog as a proper layer. */
    onBeforeClose?: (proceed: () => void) => void,
} & LayerHandler

export interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void,
    close: () => void,
}