import { forwardRef, Ref } from "react"
import { EditorHandler, WithEditorProps } from "./types"
import Editor from "."

const withEditor = <P extends object>(Component: React.ComponentType<P>) => {
    return forwardRef<EditorHandler, P & WithEditorProps>((props, ref) => {
        const { withEditor, ...rest } = props

        if ( withEditor ){
            return <Editor ref={ref as Ref<EditorHandler>}>
                <Component {...(rest as P)} />
            </Editor>
        }

        return <Component ref={ref as Ref<any>} {...(rest as P)} />
    })
}

export default withEditor