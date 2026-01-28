import { forwardRef, useMemo } from "react";
import { useDelayed } from "../..";
import { addPropsToChildren } from "../../funs";
import Box, { BoxProps } from "../Box";

const Group = forwardRef<HTMLDivElement, BoxProps & {
    fxDelay?: number,
    fxStep?: number,
    classToIgnore?: string
}>((props, ref) => {

    const { children, fx, fxDelay, fxStep, classToIgnore, ...rest } = props

    const when = useDelayed()
    
    const Children = useMemo(() => {

        if (!fx) return children;

        return addPropsToChildren(
            children, 
            child => {
                const props = child.props || {};
                const hasFxProp = 'fx' in props;
                const className = props.as ? Array.isArray(props.as) ? props.as.join(` `) : props.as : props.className || '';
                const hasIgnoreClass = typeof className === 'string' && className.includes(classToIgnore || `--ignore`);
                return !hasFxProp && !hasIgnoreClass;
            },
            index => ({ fx: {
                ...fx,
                delay: (fxDelay || 0) + index * (fxStep || .1), // how to increment per index ?
                when
            } })
        )
    }, [children, when, fx])

    return <Box className={`--group`} ref={ref} {...rest}>
        {Children}
    </Box>

})

Group.displayName = `Zuz.Group`

export default Group
