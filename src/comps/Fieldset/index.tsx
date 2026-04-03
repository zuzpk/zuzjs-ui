import { Ref } from "react"
import { useBase } from "../../hooks"
import { useTheme } from "../../hooks/useColorScheme"
import { Variant } from "../../types"
import Box from "../Box"
import { FieldsetProps } from "./types"

const Fieldset = ({
    ref,
    children,
    ...props
} : FieldsetProps & {
    ref?: Ref<HTMLDivElement>
}) => {

    const { legend, legendPlacement, variant, ...pops } = props
    const { variant: themeVariant } = useTheme(true)!
    const {
        className,
        style,
        rest
    } = useBase(pops)

    return <Box 
        as={`--fieldset --rel --flex --${variant || themeVariant || Variant.Medium} ${className}`.trim()}
        style={style}>
            <Box as={`--legend --abs --${legendPlacement || `top-start`}`}>
                {legend && 
                    typeof legend === "string" ? 
                        <legend>{legend}</legend> : legend}
            </Box>
        {children}
    </Box>

}

export default Fieldset