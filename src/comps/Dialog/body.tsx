"use client"
import React, { ReactNode } from 'react';
import { DialogActionHandler } from './types';
import Box from '../Box';
import { ValueOf, Variant } from '../../types';
import ScrollView from '../ScrollView';
import Flex from '../Flex';

const DialogBody : React.FC<{
    action?: DialogActionHandler[] | null,
    render?: boolean,
    message?: string | ReactNode,
    variant?: ValueOf<typeof Variant>
}> = ({
    action,
    render = true,
    message = ``
}) => {
    
    return <ScrollView as={`flex --body rel ${action ? `` : `--no-action`}`}>
        {render ? message : null}
    </ScrollView>
}

export default DialogBody;