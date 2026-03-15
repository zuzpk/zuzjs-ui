"use client"
import React from 'react';
import Box from '../Box';
import Icon from '../Icon';
import Text from '../Text';

const OptionGroupHead : React.FC<{
    label: string;
    icon?: string;
}> = ({ label, icon }) => {
    return <Box as={`--select-options-head --no-shrink --disabled`.trim()} aria-hidden="true">
        {icon && <Icon name={icon} />}
        <Text as="--select-group-label">{label}</Text>
    </Box>
}

export default OptionGroupHead;