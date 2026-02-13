import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant, type BoxProps } from "../../types";
import Box from "../Box";
import { SPINNER, SpinnerProps } from "./types";

const Spinner = (props : SpinnerProps) => {

    const { type, variant, color, ...pops } = props;
    const {
        className,
        style,
        rest
    } = useBase(pops)

    const { spinner: themeSpinner } = useTheme(true)!
    
    // const build = () : CSSProperties => {

    //     const _props : CSSProperties = {} 
    //     // ( type || SPINNER.Simple ) == SPINNER.Simple ? {
    //     //     animationDuration: `${speed || .6}s`
    //     // } : {
    //     //     // ..._animationSetting
    //     // }
    //     return _props
        
    // }

    const child = () => {
        switch( type || themeSpinner?.type || SPINNER.Simple ){
            case SPINNER.Simple:
                return null
            case SPINNER.Wave:
                return  <>
                    <Box as={`--bar --bar1`} />
                    <Box as={`--bar --bar2`} />
                    <Box as={`--bar --bar3`} />
                </>
            case SPINNER.Roller:
                return null
        }
    }

    return <Box
        className={`${className} --spinner --${(type || themeSpinner?.type || SPINNER.Simple).toLowerCase()} --${variant || themeSpinner?.variant || Variant.Small}`.trim()}
        style={{
            ...style,
            // ...build()
        }}
        {...rest as BoxProps}>
        {child()}
    </Box>

}

Spinner.displayName = `Zuz.Spinner`

export default Spinner;