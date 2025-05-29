import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';

export type ImageProps = Props<`img`> & {
    
}

const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {

    const {
        style,
        className,
        rest
    } = useBase<"img">(props)
    
    if ( !rest.src || rest.src == `` ) return null

    return <img 
        ref={ref}
        style={style}
        className={`${className} flex`}
        {...rest} />

})

Image.displayName = `Zuz.Image`

export default Image