"use client"
import { KeyCode, useShortcuts } from '@zuzjs/hooks';
import React, { useMemo, useRef } from 'react';
import useDialog from '../hooks/useDialog';
import { DialogController } from '../types';
import DevToolsBox from './tools';

const DevTools : React.FC = (_props) => {

    const dialog = useDialog()
    const dh = useRef<DialogController>(null)

    const shortcutsConfig = useMemo(() => [
        { 
            keys: [KeyCode.F5], 
            callback: () => {
                dh.current = dialog.show({
                    noHead: true,
                    withClass: `--devtools`,
                    content: <DevToolsBox />
                })
            }
        }
    ], []);

    useShortcuts(shortcutsConfig)
    
    return null

}

export default DevTools;