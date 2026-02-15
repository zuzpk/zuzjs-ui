"use client"
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { ValueOf } from "../../types";
import { TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import { BoxProps } from "../../types/interfaces";
import Group from "../Group";
import Spinner from "../Spinner";
import { SPINNER } from "../Spinner/types";
import Text from "../Text";

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
    const { spinner: themeSpinner } = useTheme(true)!

    if ( `when` in props && props.when == false ){
        return null
    }

    return <Group
        fx={{
            transition: TRANSITIONS.SlideInBottom,
            curve: TRANSITION_CURVES.Liquid,
            duration: 0.5
        }}
        fxDelay={0.1}
        fxStep={0.05}
        className={`--cover flex aic jcc cols abs fill nope nous ${className}`.trim()}
        style={{
            ...style,
            backgroundColor: `var(--cover-bg)`
        }}
        {...rest as BoxProps}>
        {<Spinner variant={spinnerSize || themeSpinner?.variant || Variant.Small} type={spinner || themeSpinner?.type || SPINNER.Simple} />}
        {!hideMessage && <Text 
            className={`--label`}
            style={{ color: `var(--cover-label)`  }}>{message || `loading`}</Text>}
    </Group>

})

Cover.displayName = `Zuz.Cover`

export default Cover