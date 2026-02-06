import { forwardRef, Fragment, useMemo } from "react";
import Box from "../Box";
import { BoxProps } from "../../types/interfaces";
import { useDelayed } from "@zuzjs/hooks";
import { addPropsToChildren } from "@zuzjs/core";
import { useTheme } from "../../hooks/useColorScheme";

export type GroupProps = BoxProps & {
    fxDelay?: number,
    fxStep?: number,
    classToIgnore?: string
}

const Group = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {

    const { 
        children, 
        fx, 
        fxDelay, 
        fxStep, 
        classToIgnore, 
        ...rest 
    } = props
    const theme = useTheme(true)
    const when = useDelayed()
    
    const _fx = fx || theme?.group?.fx
    const _fxDelay = fxDelay || theme?.group?.fxDelay
    const _fxStep = fxStep || theme?.group?.fxStep
    const _classToIgnore = classToIgnore || theme?.group?.classToIgnore

    const Children = useMemo(() => {

        if (!_fx) return children;

        return addPropsToChildren(
            children, 
            child => {
                if ( child.type === Fragment ) return false;
                const props = child.props || {};
                const hasFxProp = 'fx' in props;
                const className = props.as ? Array.isArray(props.as) ? props.as.join(` `) : props.as : props.className || '';
                const hasIgnoreClass = typeof className === 'string' && className.includes(classToIgnore || `--ignore`);
                return !hasFxProp && !hasIgnoreClass;
            },
            index => ({ fx: {
                ..._fx,
                delay: (_fxDelay || 0) + index * (_fxStep || .1), // how to increment per index ?
                when
            } })
        )
    }, [children, when, _fx])

    return <Box className={`--group`} ref={ref} {...rest}>
        {Children}
    </Box>

})

Group.displayName = `Zuz.Group`

export default Group
