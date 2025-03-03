'use client'
import { forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Tab, TabProps, TabViewHandler, TabViewProps } from "./types";
import { uuid } from "../../funs";
import { useResizeObserver } from "../../hooks";
import Box, { BoxProps } from "../Box";
import TabItem from "./tab";


const TabView = forwardRef<TabViewHandler, TabViewProps>((props, ref) => {
    
    const { as, tabs: _tabs, speed, prerender, onChange, ...rest } = props;
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

    const handleTabClick = (index: number) => {
        setActiveTab(index)
    };

    useEffect(() => {
        onChange && onChange(tabs[0], 0)
    }, [])


    return <Box
        ref={tabview}
        className={`--tabview flex cols`}>

        <Box className={`--head flex aic`}>
            {tabs.map((tab, index) => <TabItem 
                key={`tab-${tabViewID}-${tab.key || index}`}
                tab={tab} 
                index={index}
                activeTab={activeTab}
                onClick={idx => {
                    handleTabClick(idx)
                    tab.onSelect && tab.onSelect(tab, idx)
                    onChange && onChange(tab, idx)
                }}
            />)}
        </Box>

        <Box className={`--body rel`}>
            <Box className={`--track flex aic`}
                style={{
                    transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)`
                }}>
                {tabs.map((tab, index) => <Box 
                    style={{ 
                        width: size.width,
                        minWidth: size.width,
                        maxWidth: size.width,
                        opacity: index === activeTab ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                    }}
                    className={`--content`}>{(render || activeTab == index) && tab.body}</Box>)}
            </Box>
        </Box>

    </Box>
    
})

export default TabView