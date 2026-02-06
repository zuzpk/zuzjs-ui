import { ValueOf } from "../../types"
import { Position } from "../../types/enums"

export type CookieConsentProps = {
    title?: string,
    message?: string,
    acceptLabel?: string,
    rejectLabel?: string,
    position?: ValueOf<typeof Position>
}