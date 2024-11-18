import { useState } from "react"
import { cssWithKeys } from "../../../funs/stylesheet"
import { cssShortKey } from "../../../types"
import { SLIDER } from "../../../types/enums"
import Box from "../../Box"
import Button from "../../Button"
import Select from "../../Select"
import Slider from "../../Slider"
import SVGIcons from "../../svgicons"
import Text from "../../Text"
import { PropProps } from "../types"
import { Option, Value } from "../../Select/types"

const Prop = (props : PropProps) => {

    const { meta, onChange, addKeyframe } = props
    const [ k, u ] = Object.keys(meta)
    const [ unit, setUnit ] = useState(meta.unit)
    const [ value, setValue ] = useState(meta[k as cssShortKey])

    const handleChange = (e? : number) => {
        onChange({
            [k]: e || value,
            unit: unit
        })
    }


    return <Box
        className={`--sub-prop flex aic`}>
        <Button 
            onClick={e => addKeyframe()}
            className={`--add-key`}>{SVGIcons.addKey}</Button>
        <Text className={`--plbl`}>{cssWithKeys[k as cssShortKey]}</Text>
        <Box className={`--value flex aic jce`}>
            {/* <Box as={`--chv`}>{SVGIcons.chevronLeftOutline}</Box> */}
            <Slider 
                onChange={e => handleChange(e as number)}
                min={-100}
                max={100}
                step={1}
                roundValue={true}   
                type={SLIDER.Text} />
            <Select
                onChange={(v) => {
                    setUnit((v as Option).value)
                    handleChange((+(v as Option).value))
                }}
                selected={meta.unit}
                options={[
                    { label: `px`, value: `px` },
                    { label: `vw`, value: `vw` },
                    { label: `vh`, value: `vh` },
                    { label: `%`, value: `%` },
                    { label: `deg`, value: `deg` },
                ]}
            />
            {/* <Box as={`--chv`}>{SVGIcons.chevronRightOutline}</Box> */}
        </Box>
    </Box>
}

export default Prop