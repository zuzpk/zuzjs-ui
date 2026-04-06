"use client"
import React from 'react';
import { DIALOG_ACTION_POSITION, ValueOf, Variant } from '../../types';
import Button from '../Button';
import Flex from '../Flex';
import { DialogActionHandler } from './types';

const DialogFooter : React.FC<{
    action: DialogActionHandler[],
    dialogID: string,
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>,
    variant?: ValueOf<typeof Variant>,
    useForm?: boolean,
}> = ({
    useForm,    
    action,
    actionPosition,
    dialogID,
    variant
}) => {
    return <Flex aic as={`--footer rel ${actionPosition ? actionPosition == DIALOG_ACTION_POSITION.Center ? `--jcc` : `` : `--jce`}`.trim()}>
        {action.map((a: DialogActionHandler, i: number) => <Button 
            key={`dialog-${dialogID}-action-${a.key || i}`}  
            variant={variant}
            kind={a.kind}
            type={a.type || `button`}
            onClick={() => {
                if ( useForm === true && a.type === `submit` ) return;
                if (a.handler) return a.handler();
                if (a.onClick) return a.onClick();
                console.log(`onClick Handler missing`)
            }}
            as={`--action`}>{a.label}</Button>)}
    </Flex>
}

export default DialogFooter;