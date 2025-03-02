import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react";
import { TreeItemHandler, TreeItemProps } from "./types";
import Box, { BoxProps } from "../Box";
import Button from "../Button";
import Icon, { IconProps } from "../Icon";
import Text, { TextProps } from "../Text";
import SVGIcons from "../svgicons";


const TreeItem = forwardRef<TreeItemHandler, TreeItemProps>((props, ref) => {

    const { as, meta, nodes, icons, onSelect, treeTag, selected, ...rest } = props
    const { tag, label, icon, under, isHead } = meta
    
    const [isOpen, setIsOpen] = useState( tag == `root` );

    const toggle = () => {
        localStorage.setItem(`--tn${treeTag}-${tag}`, isOpen ? `0` : `1`)
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if ( tag == `root` && !localStorage.getItem(`--tn${treeTag}-${tag}`) ){
            localStorage.setItem(`--tn${treeTag}-${tag}`, `1`)
            setIsOpen(true)
        }
        else
            setIsOpen(localStorage.getItem(`--tn${treeTag}-${tag}`) == `1`)
    }, [])

    const _nodes = nodes.filter(x => x.under == tag)

    return <Box className={`--treenode --treenode-${tag} flex cols`}>

        <Box 
            className={`--node --node-${tag} flex aic${selected == tag ? ` --selected` : ``}`}>
            <Button
                skeleton={rest.skeleton}
                onClick={toggle}
                className={`--node-aro-btn`}
                disabled={_nodes.length == 0}>
                { icons ? <Icon 
                    skeleton={rest.skeleton}
                    className={`--node-aro-icon`}
                    name={_nodes.length == 0 ? icons?.arrowDisabled || icons?.arrowClose : isOpen ? icons?.arrowOpen : icons?.arrowClose} /> 
                    : _nodes.length == 0 ? SVGIcons.chevronBottom : isOpen ? SVGIcons.chevronBottom : SVGIcons.chevronRight }
            </Button>
            <Button 
                className={`--node-meta flex aic`}
                onClick={(e) => onSelect(tag)}>
                { icons?.nodeOpen && icons?.nodeClose && <Icon 
                    skeleton={rest.skeleton}
                    className={`--node-icon`}
                    name={icon || ( isOpen ? icons?.nodeOpen : icons?.nodeClose )} /> }
                <Text {...{ className: `--node-label`} as TextProps} skeleton={rest.skeleton}>{label}</Text>
            </Button>
        </Box>

        {isOpen && _nodes.length > 0 && <Box 
            className={`--sub-node tree-sub-node-${tag} flex cols`}>
            {_nodes.map(node =>  <TreeItem
                key={`--node-${node.tag}`}
                treeTag={treeTag}
                selected={selected} 
                onSelect={onSelect}
                icons={icons}
                meta={node}
                nodes={nodes}
                />)}</Box>}

    </Box>

})

export default TreeItem