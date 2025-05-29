import { forwardRef } from "react";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import List from "../List";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CrumbProps } from "./types";

const Crumb = forwardRef<HTMLUListElement | HTMLOListElement, CrumbProps>((props, ref) => {

    const { items } = props

    return <List 
        ref={ref}
        className={`--crumb flex aic`}
        direction={`rows`}
        seperator={<Box as={`--crumb-chevron`}>{SVGIcons.chevronRightOutline}</Box>}
        items={items.map((item, index, _items) => <Button 
            onClick={() => item.action?.()}
            className={`--crumb-item`} disabled={!_items[index+1]}>
            { item.icon && <Icon as={`--crumb-icon`} name={item.icon} />}
            <Text as={`--crumb-label`}>{item.label}</Text>
        </Button>)}
    />

})

Crumb.displayName = `Zuz.Crumb`

export default Crumb