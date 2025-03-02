"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import { EditorMode } from './types';
import Box from '../Box';
const Editor = forwardRef((props, ref) => {
    const [mode, setMode] = React.useState(EditorMode.Select);
    return _jsx(Box, { as: `--ui-builder rel` });
});
export default Editor;
