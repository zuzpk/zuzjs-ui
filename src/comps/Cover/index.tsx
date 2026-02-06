"use client"
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { Variant } from "../../types/enums";
import Box from "../Box";
import Spinner from "../Spinner";
import Text from "../Text";
import { BoxProps } from "../../types/interfaces";
import { ValueOf } from "../../types";
import { SPINNER } from "../Spinner/types";

export type CoverProps = BoxProps & {
    message?: string,
    spinner?: ValueOf<typeof SPINNER>,
    spinnerSize?: ValueOf<typeof Variant>,
    color?: string,
    when?: boolean,
    hideMessage?: boolean
}

const Cover = forwardRef<HTMLDivElement, CoverProps >((props, ref) => {

    const { message, spinner, spinnerSize, color, when, hideMessage, ...pops } = props;
    
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
        {<Spinner variant={spinnerSize || Variant.Small} type={spinner || SPINNER.Simple} />}
        {!hideMessage && <Text 
            className={`--label`}
            style={{ color: `var(--cover-label)`  }}>{message || `loading`}</Text>}
    </Box>

})

Cover.displayName = `Zuz.Cover`

export default Cover