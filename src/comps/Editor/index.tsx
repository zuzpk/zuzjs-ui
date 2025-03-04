"use client"
import React, { forwardRef } from 'react';
import Box from '../Box';
import { EditorHandler, EditorMode, EditorProps } from './types';

const Editor = forwardRef<EditorHandler, EditorProps>((props, ref) => {

    const [mode, setMode] = React.useState(EditorMode.Select)

    return <Box as={`--ui-builder rel`}>
        {/* <ActionBar
            as={`abs!`}
            selected={mode}
            items={[
                { tag: EditorMode.Select, label: `Choose Element`, icon: SVGIcons.mouse, onClick: () => console.log('Choose Element') },
                { tag: EditorMode.Animation, label: `Animation`, icon: SVGIcons.animation, onClick: () => console.log('Animation') },
                { tag: EditorMode.Keyframe, label: `Keyframe`, icon: SVGIcons.add, onClick: () => console.log('Style') },
                { tag: EditorMode.Play, label: `Play`, icon: SVGIcons.play, onClick: () => console.log('Play') },
            ]}
        /> */}
        {/* {props.children} */}
        {/* <Timeline /> */}
    </Box>

})

Editor.displayName = `Editor`

export default Editor;