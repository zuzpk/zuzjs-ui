import { forwardRef, useMemo } from "react";
import { useDelayed } from "../..";
import { addPropsToChildren } from "../../funs";
import Box, { BoxProps } from "../Box";

const Group = forwardRef<HTMLDivElement, BoxProps & {
    fxDelay?: number,
    fxStep?: number
}>((props, ref) => {

    const { children, fx, fxDelay, fxStep, ...rest } = props

    const when = useDelayed()

    const Children = useMemo(() => {

        if (!fx) return children;

        return addPropsToChildren(
            children, 
            child => !(`fx` in (child.props ??  {})),
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
