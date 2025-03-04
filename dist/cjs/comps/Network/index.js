import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect } from "react";
import { useNetworkStatus } from "../../hooks";
import { ALERT, Size, TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import SVGIcons from "../svgicons";
import Text from "../Text";
const NetworkManager = forwardRef((props, ref) => {
    const isOnline = useNetworkStatus();
    const { onlineMessage, offlineMessage, size } = props;
    useEffect(() => {
    }, []);
    return _jsxs(Box, { animate: {
            from: { x: `-50%`, y: 200, opacity: 0 },
            to: { x: `-50%`, y: 0, opacity: 1 },
            when: isOnline == false,
            curve: TRANSITION_CURVES.Spring,
            duration: 0.5,
            delay: 2
        }, className: `--network-manager --${isOnline == true ? `online` : `offline`} --${size || Size.Small} fixed flex`, children: [_jsx(Box, { className: `--ico`, children: isOnline ? SVGIcons[ALERT.Success] : SVGIcons[ALERT.Error] }), _jsx(Text, { as: `--message`, children: isOnline ? onlineMessage || `internet connection restored :)` : offlineMessage || `no internet connection` })] });
});
NetworkManager.displayName = `NetWorkManager`;
export default NetworkManager;
