"use client"
import { forwardRef, useState } from "react";
import Box from "../Box";
import Button from "../Button";
import Text from "../Text";
import SVGIcons from "../svgicons";
import { AccordionHandler, AccordionProps } from "./types";

const Accordion = forwardRef<AccordionHandler, AccordionProps>((props, ref) => {
    
    const { title, message, ...rest } = props;
    const [ visible, setVisible ] = useState(false)

    return <Box className={`--accordion flex cols`} { ...rest }>
        <Button
            onClick={(e) => setVisible(!visible)}
            className={`--toggle flex aic ${visible ? `--open` : ``}`.trim()}>
            <Text className={`--label flex`}>{title}</Text>
            <Box className={`--arrow flex`}>{visible ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box>
        </Button>
        {visible && <Box className={`--detail`}>{message}</Box>}
    </Box>


})

Accordion.displayName = `Zuz.Accordion`

export default Accordion