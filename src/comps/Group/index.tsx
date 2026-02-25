import { addPropsToChildren } from "@zuzjs/core/react";
import { useDelayed } from "@zuzjs/hooks";
import { forwardRef, Fragment, useMemo } from "react";
import { useTheme } from "../../hooks/useColorScheme";
import { BoxProps } from "../../types/interfaces";
import Box from "../Box";

export type GroupProps = BoxProps & {
    when?:  boolean,
    fxDelay?: number,
    fxStep?: number,
    classToIgnore?: string
}

const Group = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {

    const { 
        children, 
        fx, 
        when,
        fxDelay, 
        fxStep, 
        classToIgnore, 
        ...rest 
    } = props
    const theme = useTheme(true)
    const _when = useDelayed()
    
    const _fx = fx || theme?.group?.fx
    const _fxDelay = fxDelay || theme?.group?.fxDelay
    const _fxStep = fxStep || theme?.group?.fxStep
    const _classToIgnore = classToIgnore || theme?.group?.classToIgnore || `-fx`

    const Children = useMemo(() => {

        if (!_fx) return children;

        return addPropsToChildren(
            children, 
            child => {
                if ( child.type === Fragment ) return false;
                const props = child.props || {};
                const hasFxProp = 'fx' in props;
                const className = props.as ? Array.isArray(props.as) ? props.as.join(` `) : props.as : props.className || '';
                // console.log(`--group`, props.as, props.className)
                const hasIgnoreClass = typeof className === 'string' && className.includes(_classToIgnore);
                return !hasFxProp && !hasIgnoreClass;
            },
            index => ({ fx: {
                ..._fx,
                delay: (_fxDelay || 0) + index * (_fxStep || .1), // how to increment per index ?
                when: when == undefined ? fx?.when || _when : when
            } })
        )
    }, [children, when, _when, _fx])

    return <Box className={`--group`} ref={ref} {...rest}>
        {Children}
    </Box>

})

Group.displayName = `Zuz.Group`

export default Group
