"use client"
import React, { ReactNode } from 'react';
import { ValueOf, Variant } from '../../types';
import Button from '../Button';
import Flex from '../Flex';
import SVGIcons from '../svgicons';
import Text from '../Text';

const DialogHead : React.FC<{
    title?: string | ReactNode,
    description?: string | ReactNode,
    titlePosition?: `left` | `center` | `right`,
    onClose: () => void,
    variant?: ValueOf<typeof Variant>
}> = ({
    title = `Alert`,
    description,
    titlePosition = `center`,
    onClose
}) => {
    return <Flex as={`--head rel`}>
        <Flex cols 
            as={[
                `--${title ? `title` : `dot`} rel`,
                `--position-${titlePosition}`
            ]}>
            <Text>{title}</Text>
            {description && <Text as={`--description`}>{description}</Text>}
        </Flex>
        <Button 
            onClick={(e) => onClose()}
            className={`--closer abs ${titlePosition == `center` ? `center-v` : ``}`}>
                {SVGIcons.close}
            </Button>
    </Flex>
}

export default DialogHead;