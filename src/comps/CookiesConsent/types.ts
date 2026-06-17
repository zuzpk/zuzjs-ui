import { ValueOf } from "../../types"
import { Position, Variant } from "../../types/enums"

export type CookieConsentProps = {
    title?: string,
    message?: string,
    acceptLabel?: string,
    rejectLabel?: string,
    position?: ValueOf<typeof Position>,
    variant?: ValueOf<typeof Variant>,
    onAccept?: () => void,
    onReject?: () => void
}