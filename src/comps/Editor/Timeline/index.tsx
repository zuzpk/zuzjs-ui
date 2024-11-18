import { forwardRef, useEffect, useRef, useState } from "react"
import Box from "../../Box"
import Button from "../../Button"
import SVGIcons from "../../svgicons"
import Text from "../../Text"
import Layer from "./layer"
import { LayerProps, LayerType, TimeLineLayer, TimeLineProps } from "../types"
import Slider from "../../Slider"
import { DRAG_DIRECTION, SLIDER } from "../../../types/enums"
import ToolTip from "../../Tooltip"

const Timeline = forwardRef<HTMLDivElement, TimeLineProps>((props, ref) => {

    const { layers } = props
    const [ selected, setSelected ] = useState<TimeLineLayer[]>([])
    const [ duration, setDuration ] = useState(1)
    const sideBar = useRef<HTMLDivElement>(null)
    const cursorLimit = useRef<{ left: number, right: number, snap: number }>({ left: 0, right: 0, snap: 1 })

    const onLayerSelect = (layer: TimeLineLayer) => {
        const { src } = layer
        if ( src! ){
            const { width, height, x, y } = src.current.getBoundingClientRect()    
            src.current.classList.add(`--with-timeline`)
        }
        if ( selected.includes(layer) ){
            setSelected(selected.filter(a => a !== layer))
        }
        else{
            setSelected([...selected, layer])
        }
    }

    const buildTimelineStamps = (step = 0.1) => {
        const stamps = []
        for( let i = 0 ; i < duration; i += step ){
            stamps.push(<Text key={`tstmp-${i}`} className={`--stmp`}>{i.toFixed(1)}</Text>)
        }
        return stamps
    }

    useEffect(() => {
        if ( sideBar.current ){
            const w = document.querySelector(`.--head .--track .--stamps .--stmp`)!.getBoundingClientRect().width
            cursorLimit.current = {
                left: 0, //sideBar.current.offsetLeft,
                right: window.innerWidth - sideBar.current.offsetWidth - 10,
                snap: w
            }
        }
    }, [duration])

    // console.log(cursorLimit.current)

    return <Box
        className={`--timeline fixed flex`}>

        <Box
            className={`--layers flex cols`}>
            <Box className={`--layer --head flex aic`}>
                <Box ref={sideBar} className={`--meta flex aic jcc`}>
                    <Box className={`--buns flex aic`}>
                        <Button className={`--pbtn`}>{SVGIcons.prev}</Button>
                        <Button className={`--pbtn`}>{SVGIcons.play}</Button>
                        <Button className={`--pbtn`}>{SVGIcons.next}</Button>
                    </Box>
                    <Box className={`--bus flex aic`}>
                        <ToolTip title={`Duration`}>
                            <Box className={`--choose-time flex aic jcc`}>
                                <Slider 
                                    onChange={e => setDuration(e as number)}
                                    value={1}
                                    type={SLIDER.Text} min={1} max={10} step={1} />
                                <Text className={`--duration`}>s</Text>
                            </Box>
                        </ToolTip>
                        <ToolTip title={`Add Style`}>
                            <Button className={`--pbtn`}>{SVGIcons.add}</Button>
                        </ToolTip>
                    </Box>
                </Box>
                <Box className={`--track flex aic`}>
                    <Box as={`--stamps flex aic`}>
                        {buildTimelineStamps()}
                    </Box>
                    
                </Box>
            </Box>

            {layers && layers.length > 0 && layers.map((a, i) => <Layer 
                meta={a}
                index={i+1}
                selected={selected.includes(a)}
                onSelect={onLayerSelect}
                key={`layer-track-${i}`} />)}
            
        </Box>

        <Box 
            draggable={true} 
            dragOptions={{
                direction: DRAG_DIRECTION.x,
                snap: cursorLimit.current.snap,
                limits: {
                    left: cursorLimit.current.left,
                    right: cursorLimit.current.right
                }
            }}
            className={`--cursor abs`}></Box>

    </Box>
})

export default Timeline