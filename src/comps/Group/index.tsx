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

/**
 * Group component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Group>Group content</Group>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Group spacing="md" variant="card" direction="vertical">Grouped elements</Group>
 * ```
 * @param spacing - spacing prop
 * @param variant - Visual variant or style
 * @param direction - direction prop
 */
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
                const hasTextFxProp = 'tfx' in props;
                const className = props.as ? Array.isArray(props.as) ? props.as.join(` `) : props.as : props.className || '';
                // console.log(`--group`, props.as, props.className)
                const hasIgnoreClass = typeof className === 'string' && className.includes(_classToIgnore);
                return !hasIgnoreClass && (!hasFxProp || hasTextFxProp);
            },
            (index, element) => {
                const groupDelay = (_fxDelay ?? 0) + index * (_fxStep ?? .1)
                const elementProps = element.props || {}

                if ('tfx' in elementProps) {
                    return {
                        delay: (elementProps.delay ?? 0) + groupDelay
                    }
                }

                return { fx: {
                    ..._fx,
                    delay: groupDelay,
                    when: when == undefined ? fx?.when || _when : when
                } }
            }
        )
    }, [children, when, _when, _fx, _fxDelay, _fxStep, _classToIgnore, fx])

    return <Box className={`--group`} ref={ref} {...rest}>
        {Children}
    </Box>

})

Group.displayName = `Zuz.Group`

export default Group
