import { forwardRef } from "react"
import { SidebarProps } from "./types"
import Box from "../Box"

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>((props, ref) => {

    const { layout, logo } = props

    return <Box 
        ref={ref}
        className={`--sidebar --${layout || `2-columns`} flex cols`}>

        <Box as={`--logo`}>
            {logo}
        </Box>

        <Box as={`--nav flex cols`}>
            
        </Box>

    </Box>


})

export default Sidebar