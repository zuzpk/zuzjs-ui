"use client"
import React, { ReactNode } from 'react';
import { DialogActionHandler } from './types';
import Box from '../Box';
import { ValueOf, Variant } from '../../types';

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
    
    return <Box as={`--body flex aic rel ${action ? `` : `--no-action`}`.trim()}>
        {render ? message : null}
    </Box>
}

export default DialogBody;