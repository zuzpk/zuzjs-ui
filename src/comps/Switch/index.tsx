import { forwardRef } from "react"
import { CheckboxHandler, CheckBoxProps } from "../CheckBox/types"
import CheckBox from "../CheckBox"
import { CHECKBOX } from "../../types/enums"

const Switch = forwardRef<CheckboxHandler, CheckBoxProps>((props, ref) => {

    return <CheckBox type={CHECKBOX.Switch} {...props} ref={ref} />

})

export default Switch