import { Size } from "../../types/enums";
import { BoxProps } from "../Box";

export type NetworkManagerprops = BoxProps & {
    size?: Size,
    offlineMessage?: string,
    onlineMessage?: string,
}