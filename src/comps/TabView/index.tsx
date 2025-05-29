"use client"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Segment, SelectTabs } from "../..";
import { uuid } from "../../funs";
import { useBase, useResizeObserver } from "../../hooks";
import Box from "../Box";
import TabBody from "./body";
import { Tab, TabViewHandler, TabViewProps } from "./types";


const TabView = forwardRef<TabViewHandler, TabViewProps>((props, ref) => {
    
    const { tabs: _tabs, speed, prerender, variant, onChange, ...rest } = props;
    const tabs = useMemo(() => _tabs.reduce((ts, t: Tab) => {
        ts.push({
            ...t,
            key: t.key || uuid()
        })
        return ts
    }, [] as Tab[]), [_tabs])
    const tabview = useRef<HTMLDivElement>(null)
    const tabViewID = useMemo(() => uuid(), [])
    const [activeTab, setActiveTab] = useState(0);
    const size = useResizeObserver(tabview)
    const render = useMemo(() => prerender == undefined || prerender == true ? true : false, [])
    const {
        style,
        className
    } = useBase(rest)
    const handleTabClick = (index: number) => {
        setActiveTab(index)
    };

    useEffect(() => {
        onChange && onChange(tabs[0], 0)
    }, [])


    return <Box
        ref={tabview}
        style={style}
        className={`--tabview --${variant || "default"} flex cols ${className}`}>

        {/* <Box className={`--head flex aic`}> */}
            <SelectTabs
                as={`--tabview-head`} 
                onSwitch={(segment) => {
                    handleTabClick(segment.index);
                    const tab = tabs.find((t) => t.tag == segment.tag)
                    if ( tab && tab.onSelect ){
                        tab.onSelect(tab, segment.index);
                        onChange && onChange(tab, segment.index);
                    }
                }}
                selected={activeTab}
                items={tabs.reduce((arr, c, index) => {
                    arr.push({
                        icon: c.icon,
                        index,
                        label: c.label,
                        tag: c.tag
                    })
                    return arr
                }, [] as Segment[])}
            />
            {/* {tabs.map((tab, index) => <TabItem 
                key={`tab-${tabViewID}-${tab.key || index}`}
                tab={tab} 
                index={index}
                activeTab={activeTab}
                onClick={idx => {
                    handleTabClick(idx)
                    tab.onSelect && tab.onSelect(tab, idx)
                    onChange && onChange(tab, idx)
                }}
            />)} */}
        {/* </Box> */}

        <Box className={`--tabview-body rel`}>
            <Box className={`--track flex aic`}
                style={{
                    transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)`
                }}>
                {tabs.map((tab, index) => <TabBody 
                        key={`tab-body-${tab.key || index}-${tabViewID}`}
                        index={index}
                        active={index === activeTab}
                        size={size}
                        render={render}
                        content={tab.body}
                    />)}
            </Box>
        </Box>

    </Box>
    
})

TabView.displayName = `Zuz.TabView`

export default TabView