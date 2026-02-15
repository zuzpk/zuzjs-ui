"use client"
import React from 'react';
import { DIALOG_ACTION_POSITION, ValueOf, Variant } from '../../types';
import Box from '../Box';
import Button from '../Button';
import { DialogActionHandler } from './types';

const DialogFooter : React.FC<{
    action: DialogActionHandler[],
    dialogID: string,
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>,
    variant?: ValueOf<typeof Variant>
}> = ({
    action,
    actionPosition,
    dialogID,
    variant
}) => {
    return <Box as={`--footer flex aic rel ${actionPosition ? actionPosition == DIALOG_ACTION_POSITION.Center ? `jcc` : `` : `jce`}`.trim()}>
        {action.map((a: DialogActionHandler, i: number) => <Button 
            key={`dialog-${dialogID}-action-${a.key}`}  
            variant={variant}
            onClick={(e) => a.handler ? a.handler() : a.onClick ? a.onClick() : console.log(`onClick Handler missing`)}
            as={`--action`}>{a.label}</Button>)}
    </Box>
}

export default DialogFooter;