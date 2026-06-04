import { Variant } from "../../types"
import Button from "../Button"
import Flex from "../Flex"
import Icon from "../Icon"
import SVGIcons from "../svgicons"
import Text from "../Text"
import { TokenProps } from "./types"

const Token = (props : TokenProps) => {

    const {
        id, label, icon, color, 
        removable = true, render, subLabel,
        onRemove, onClick,
        ref, variant
    } = props

    return <Flex aic gap={4} as={`--token --no-shrink --${variant ?? Variant.Small}`} ref={ref}>
        { render ? render(props) :
            <Flex aic gap={4} onClick={() => onClick?.(props)} as={`--token-content`}>
                { icon && <Icon name={icon} /> }
                <Flex cols as={`--token-value`}>
                    <Text as={`--value`}>{label}</Text>
                    { subLabel && <Text as={`--sub-value`}>{subLabel}</Text> }
                </Flex>
            </Flex> }
        {removable && <Button 
            as={`--remove-btn`} 
            variant={variant ?? Variant.Small}
            kind={`ghost`}
            onClick={() => onRemove?.(props)}>
                {SVGIcons.close}
            </Button>}
    </Flex>

}

export default Token