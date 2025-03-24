"use client"
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { SPINNER } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import Spinner from "../Spinner";
import Text from "../Text";

export type CoverProps = BoxProps & {
    message?: string,
    spinner?: SPINNER,
    color?: string,
    when?: boolean,
    hideMessage?: boolean
}

const Cover = forwardRef<HTMLDivElement, CoverProps >((props, ref) => {

    const { message, spinner, color, when, hideMessage, ...pops } = props;
    
    const {
        className,
        style,
        rest
    } = useBase(pops)

    if ( `when` in props && props.when == false ){
        return null
    }

    return <Box
        className={`--cover flex aic jcc cols abs fillx nope nous ${className}`.trim()}
        style={{
            ...style,
            backgroundColor: `var(--cover-bg)`
        }}
        {...rest as BoxProps}>
        {<Spinner type={spinner || SPINNER.Simple} />}
        {!hideMessage && <Text 
            className={`--label`}
            style={{ color: `var(--cover-label)`  }}>{message || `loading`}</Text>}
    </Box>

})

Cover.displayName = `Cover`

export default Cover