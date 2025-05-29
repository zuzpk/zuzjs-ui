"use client"
import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Box from '../Box';

const TabBody : React.FC<{
    size: { width: number },
    index: number,
    active: boolean,
    render: boolean,
    content: string | ReactNode | ReactNode[]
}> = ({ size, index, active, render, content }) => {

    const _ref = useRef<HTMLDivElement>( null )
    const [style, setStyle] = useState<CSSProperties>({})

    useEffect(() => {
        if ( _ref.current ){

            const d = _ref.current.closest(`.--track`)?.getBoundingClientRect()
            // console.log(d?.height)
            setStyle({ height: d?.height })

        }
    }, [_ref.current])

    return <Box
        ref={_ref}
        style={{ 
            width: size.width,
            minWidth: size.width,
            maxWidth: size.width,
            opacity: active ? 1 : 0,
            transition: 'opacity 0.5s ease',
            ...style
        }}
        className={`--content`}>{(render || active) && content}</Box>
}

TabBody.displayName = `Zuz.TabBody`

export default TabBody;