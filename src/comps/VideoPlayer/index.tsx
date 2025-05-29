import { forwardRef } from "react";
import Box from "../Box";

const VideoPlayer = forwardRef((props, ref) => {

    return <Box>
        <video />
    </Box>

})

VideoPlayer.displayName = `Zuz.VideoPlayer`

export default VideoPlayer