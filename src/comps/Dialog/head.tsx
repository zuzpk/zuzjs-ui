"use client"
import React, { ReactNode } from 'react';
import Button from '../Button';
import SVGIcons from '../svgicons';
import Box from '../Box';
import { ValueOf, Variant } from '../../types';

const DialogHead : React.FC<{
    title?: string | ReactNode,
    onClose: () => void,
    variant?: ValueOf<typeof Variant>
}> = ({
    title = `Alert`,
    onClose
}) => {
    return <Box as={`--head flex aic rel`}>
        <Box as={`--${title ? `title` : `dot`} flex aic jcc rel`}>{title}</Box>
        <Button 
            onClick={(e) => onClose()}
            className={`--closer abs center-v`}>
                {SVGIcons.close}
            </Button>
    </Box>
}

export default DialogHead;