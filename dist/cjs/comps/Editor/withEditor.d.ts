import { EditorHandler, WithEditorProps } from "./types";
declare const withEditor: <P extends object>(Component: React.ComponentType<P>) => import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<P & WithEditorProps> & import("react").RefAttributes<EditorHandler>>;
export default withEditor;
