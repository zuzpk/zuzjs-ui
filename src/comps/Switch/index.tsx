import { Ref } from "react"
import { CHECKBOX } from "../../types/enums"
import CheckBox from "../CheckBox"
import { CheckboxHandler, CheckBoxProps } from "../CheckBox/types"

const Switch = ({
    ref,
    ...props
} : CheckBoxProps & {
    ref?: Ref<CheckboxHandler>
}) => {

    return <CheckBox type={CHECKBOX.Switch} {...props} ref={ref} />

}

Switch.displayName = `Zuz.Switch`

export default Switch