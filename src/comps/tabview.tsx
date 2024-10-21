import { forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import With from "./base";
import { uuid } from "../funs";
import { useResizeObserver } from "../hooks";
import ComponentEditor from "./editor";
import { BaseProps } from "../types/interfaces";

export interface Tab {
    onSelect: (tab: Tab, index: number) => void
    tag?: string,
    key?: string,
    label: string | ReactNode | ReactNode[]
    body: string | ReactNode | ReactNode[]
    render?: boolean,
}

export interface TabViewProps {
    onChange?: (tab: Tab, index: number) => void,
    speed?: number,
    tabs: Tab[],
    prerender?: boolean,
}

export interface TabViewHandler {
    setTab: (index: number) => void
}

const TabView = forwardRef<TabViewHandler, TabViewProps & BaseProps>((props, ref) => {
    
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
        // console.log(`TabRenderCount`)
        onChange && onChange(tabs[0], 0)
    }, [])

    // useEffect(() => {
    //     console.log(tabs)
    // }, [tabs])


    return <>
        <With 
            ref={tabview} 
            className={`tabview flex cols`} 
            {...rest}>

        <With className={`tab-head flex aic`}>
            {tabs.map((tab, index) => <With 
                tag={`button`}
                key={`tab-${tabViewID}-${tab.key}`} 
                className={`tab-label rel ${index === activeTab ? 'active' : ''}`.trim()} 
                onClick={() => {
                    handleTabClick(index)
                    tab.onSelect && tab.onSelect(tab, index)
                    onChange && onChange(tab, index)
                }}>{tab.label}</With>)}
        </With>

        <With 
            className={`tab-content rel`}>
            <With className={`tabs-track flex aic`} style={{ transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)` }}>
            {tabs.map((tab, index) => {

                return <With 
                // ref={tabBodyRef}
                key={`tab-body-${tabViewID}-${tab.key}`} 
                className={`tab-body rel`} 
                style={{ 
                    width: size.width,
                    minWidth: size.width,
                    maxWidth: size.width,
                    opacity: index === activeTab ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                }}>{(render || activeTab == index) && tab.body}</With>
                // onClick={() => tab.onSelect(index)}
            })}
            </With>
        </With>

    </With>
    {props.editor && <ComponentEditor
        element={`.tabview`}
        title={`TabView`} 
        attrs={{
            "@group-Head": {
                label: "Head",
                pops: {
                    "tab-head": `label:Color type:color value:auto`,
                    "tab-head-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
                }
            },
            "@group-Tabs": {
                label: "Tabs",
                pops: {
                    "tab": `label:Tab type:color value:auto`,
                    "tab-active": `label:Active type:color value:auto`,
                    "tab-hover": `label:Hover type:color value:auto`,
                }
            },
        }} />}
    </>
})

export default TabView