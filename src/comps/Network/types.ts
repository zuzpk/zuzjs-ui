import { BoxProps, ValueOf } from "../../types";
import { Variant } from "../../types/enums";

export type NetworkManagerprops = BoxProps & {
    variant?: ValueOf<typeof Variant>,
    offlineMessage?: string,
    onlineMessage?: string,
}