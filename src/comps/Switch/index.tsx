import { forwardRef } from "react"
import { CHECKBOX } from "../../types/enums"
import CheckBox from "../CheckBox"
import { CheckboxHandler, CheckBoxProps } from "../CheckBox/types"

const Switch = forwardRef<CheckboxHandler, CheckBoxProps>((props, ref) => {

    return <CheckBox type={CHECKBOX.Switch} {...props} ref={ref} />

})

Switch.displayName = `Zuz.Switch`

export default Switch