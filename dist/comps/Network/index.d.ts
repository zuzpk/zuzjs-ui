import { Size } from "../../types/enums";
declare const NetworkManager: import("react").ForwardRefExoticComponent<import("../Box").BoxProps & {
    size?: Size;
    offlineMessage?: string;
    onlineMessage?: string;
} & import("react").RefAttributes<HTMLDivElement>>;
export default NetworkManager;
