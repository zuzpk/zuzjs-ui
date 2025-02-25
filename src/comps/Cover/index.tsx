"use client"
import { forwardRef } from "react";
import Box, { BoxProps } from "../Box";
import { SPINNER } from "../../types/enums";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import { hexToRgba } from "../../funs";
import Spinner, { SpinnerProps } from "../Spinner";
import Text, { TextProps } from "../Text";

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
        className={`--cover flex aic jcc cols abs fillx nope nous`}
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

export default Cover