"use client"
import { forwardRef, useState } from "react";
import { AccordionHandler, AccordionProps } from "./types";
import Box from "../Box";
import Text from "../Text";
import SVGIcons from "../svgicons";
import Button from "../Button";

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

export default Accordion