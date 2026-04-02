import { Ref } from "react"
import { CHECKBOX } from "../../types/enums"
import CheckBox from "../CheckBox"
import { CheckboxHandler, CheckBoxProps } from "../CheckBox/types"

/**
 * Switch component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Switch onChange={(checked) => console.log(checked)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Switch defaultChecked={true} disabled={false} variant="primary" onChange={(checked) => console.log(checked)} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param disabled - Whether component is disabled
 * @param variant - Visual variant or style
 */
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