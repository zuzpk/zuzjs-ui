"use client"
import { forwardRef, useMemo } from "react";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import List from "../List";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CrumbItem, CrumbProps } from "./types";

/**
 * Crumb component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Crumb items={[{ label: "Home" }, { label: "Products" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Crumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Shoes" }]} separator="/" />
 * ```
 * @param items - Array of items
 * @param separator - separator prop
 */
const Crumb = forwardRef<HTMLUListElement | HTMLOListElement, CrumbProps>((props, ref) => {

    const { items : _crumbItems, variant, textSize, maxItems } = props
    
    const crumbItems = useMemo(() => {
        const isString = `string` == typeof _crumbItems
        const _items : CrumbItem[] = isString ? [] : _crumbItems

        if ( isString ){
            _crumbItems.split(`,`).forEach((c) => {
                _items.push({
                    label: c
                })
            })
        }

        return _items
    }, [_crumbItems])

    const canSlice = useMemo(() => maxItems && maxItems > 0 && crumbItems.length > maxItems - 1, [crumbItems, maxItems])

    const items = canSlice ?  [ 
        ...crumbItems.slice(0, 2), 
        { ID: `.`, label: `...`, icon: `ellipsis`, action: () => {} },
        ...crumbItems.slice(-maxItems!)
    ] : crumbItems

    return <List 
        ref={ref}
        className={`--crumb flex aic`}
        direction={`rows`}
        seperator={<Box as={`--crumb-chevron`}>{SVGIcons.chevronRightOutline}</Box>}
        style={textSize ? { "--text-size-custom": textSize } as React.CSSProperties : undefined}
        items={items.map((item, index, _items) => item.ID == `.` ? 
            <Box as={`flex aic gap:3`}>{Array(3).fill(null).map(() => <Box key={`--crumb-placeholder-${index}`} as={`w:4 h:4 bg:$text r:10`} />)}</Box>
            : <Button 
                variant={variant}
                onClick={() => item.action?.()}
                key={`${item.label.replace(/\s+/g, `-`).toLowerCase()}-${index}`}
                className={`--crumb-item`} disabled={!_items[index+1]}>
                { item.icon && <Icon as={`--crumb-icon`} name={item.icon} />}
                <Text as={`--crumb-label`}>{item.label}</Text>
            </Button>)}
    />

})

Crumb.displayName = `Zuz.Crumb`

export default Crumb