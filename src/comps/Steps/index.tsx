import { useId, useState } from "react";
import { Variant } from "../../types";
import { StepsProps } from "./types";
import { useBase } from "../../hooks";
import Flex from "../Flex";
import Text from "../Text";
import SVGIcons from "../svgicons";

const Steps = ({
    ref, 
    ...props
} : StepsProps) => {

    const {
        steps,
        current = 0,
        variant = Variant.Medium,
        direction = 'horizontal',
        showNumber = true,
        clickable = false,
        onChange,
        ...rest
    } = props

    const [activeIndex, setActiveIndex] = useState(current)

    const { className } = useBase(rest)
    const _id = useId()

    return <Flex aic
        as={`--stepper --${variant}`}>

        {steps.map((step, index) => {
            return <Flex 
                key={`step-${index}-${_id}`}
                as={`--step-item ${step.completed ? `--completed` : ``} ${current == index ? ` --current` : ``}`}
                aic gap={10}>
                    <Flex as={`--step --round`} aic jcc>
                        {step.completed ? SVGIcons.check
                            : index+1}
                    </Flex>
                    { step.label && <Text as={`--step-label`}>{step.label}</Text> }
                    {steps[index+1] ? <Flex as={`--step-line`} /> : null}
            </Flex>
        })}

    </Flex>


}

export default Steps