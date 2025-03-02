import React, { ReactNode } from 'react';
declare const TabBody: React.FC<{
    size: {
        width: number;
    };
    index: number;
    active: boolean;
    render: boolean;
    content: string | ReactNode | ReactNode[];
}>;
export default TabBody;
