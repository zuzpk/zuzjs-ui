import { BaseProps } from "../types/interfaces";
import { dynamicObject } from "../types";
export interface EditorProps {
    title: string;
    attrs: dynamicObject;
    element: string;
}
export interface EditorHandler {
    show: () => void;
}
declare const ComponentEditor: import("react").ForwardRefExoticComponent<EditorProps & BaseProps & import("react").RefAttributes<EditorHandler>>;
export default ComponentEditor;
