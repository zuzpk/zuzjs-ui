import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import Span from '../Span';

export type TextProps = Props<`h1` | `h2` | `h3` | `h4` | `h5` | `h6`> & {
    h?: number,
    html?: ReactNode | string,
    lines?: number
}

const Text = forwardRef<HTMLHeadingElement, TextProps>((props, ref) => {

    const { h, html, children, lines, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase(pops)

    // const textRef = useTruncateText(lines || 2)
    // const mergedRef = useMergedRefs(ref, textRef)
    const Tag = `h${props.h || 1}` as `h1` | `h2` | `h3` | `h4` | `h5` | `h6`

    return <Tag
        ref={ref}
        style={style}
        className={className}
        {...rest as HTMLAttributes<HTMLHeadingElement>}>
        {html ? <Span dangerouslySetInnerHTML={{ __html: html }} /> : children}
    </Tag>

})

Text.displayName = `ZuzUI.Text`

export default Text