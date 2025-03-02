import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import Editor from ".";
const withEditor = (Component) => {
    return forwardRef((props, ref) => {
        const { withEditor, ...rest } = props;
        if (withEditor) {
            return _jsx(Editor, { ref: ref, children: _jsx(Component, { ...rest }) });
        }
        return _jsx(Component, { ref: ref, ...rest });
    });
};
export default withEditor;
