import Button from "../Button"
import { OptionItemProps } from "./types"

const OptionItem = ({ value, updateValue, o } : OptionItemProps) => {

    return <Button
        onClick={(e) => updateValue(o)}
        className={value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}>
            {`string` == typeof o ? o : o.label}</Button>
}

export default OptionItem