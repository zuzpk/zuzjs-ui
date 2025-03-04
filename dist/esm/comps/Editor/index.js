"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import Box from '../Box';
import { EditorMode } from './types';
const Editor = forwardRef((props, ref) => {
    const [mode, setMode] = React.useState(EditorMode.Select);
    return _jsx(Box, { as: `--ui-builder rel` });
});
Editor.displayName = `Editor`;
export default Editor;
