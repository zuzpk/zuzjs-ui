import { forwardRef } from "react";
import { ALERT, TRANSITION_CURVES, Variant } from "../../types/enums";
import Box from "../Box";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { NetworkManagerprops } from "./types";
import { useNetworkStatus } from "@zuzjs/hooks";

/**
 * Network component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Network nodes={[{ id: "1", label: "Node 1" }]} links={[]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Network nodes={[{ id: "1", label: "A" }, { id: "2", label: "B" }]} links={[{ source: "1", target: "2" }]} />
 * ```
 * @param nodes - Tree node definitions
 * @param links - Links between nodes
 */
const NetworkManager = forwardRef<HTMLDivElement, NetworkManagerprops>((props, ref) => {

    const isOnline = useNetworkStatus()
    const { onlineMessage, offlineMessage, variant } = props

    return <Box 
        fx={{
            from: { x: `-50%`, y: 200, opacity: 0 },
            to: { x: `-50%`, y: 0, opacity: 1 },
            when: isOnline == false,
            curve: TRANSITION_CURVES.Spring,
            duration: 0.5,
            delay: 2
        }}
        className={`--network-manager --${isOnline == true ? `online` : `offline`} --${variant || Variant.Small} fixed flex`}>
        <Box className={`--ico`}>
            {isOnline ? SVGIcons[ALERT.Success] : SVGIcons[ALERT.Error]}
        </Box>
        <Text as={`--message`}>{isOnline ? onlineMessage || `internet connection restored :)` : offlineMessage || `no internet connection`}</Text>
    </Box>

})

NetworkManager.displayName = `Zuz.NetWorkManager`

export default NetworkManager;