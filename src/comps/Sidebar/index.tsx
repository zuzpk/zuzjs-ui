import { forwardRef } from "react"
import Box from "../Box"
import { SidebarProps } from "./types"

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

Sidebar.displayName = `Sidebar`

export default Sidebar