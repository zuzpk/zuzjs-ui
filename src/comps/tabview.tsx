import { forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import With from "./base";
import { uuid } from "../funs";
import { useResizeObserver } from "../hooks";
import ComponentEditor from "./editor";
import { BaseProps } from "../types/interfaces";

export interface Tab {
    onSelect: (index: number) => void
    label: string | ReactNode | ReactNode[]
    body: string | ReactNode | ReactNode[]
    render?: boolean,
}

export interface TabViewProps {
    speed?: number,
    tabs: Tab[]
}

export interface TabViewHandler {
    setTab: (index: number) => void
}

const TabView = forwardRef<TabViewHandler, TabViewProps & BaseProps>((props, ref) => {
    
    const { as, tabs, speed, ...rest } = props;
    const tabview = useRef<HTMLDivElement>(null)
    const tabViewID = useMemo(() => uuid(), [])
    const [activeTab, setActiveTab] = useState(0);
    const size = useResizeObserver(tabview)

    const handleTabClick = (index: number) => {
        setActiveTab(index)
    };

    useEffect(() => {
        
    }, [])

    return <>
        <With 
            ref={tabview} 
            className={`tabview flex cols`} 
            {...rest}>

        <With className={`tab-head flex aic`}>
            {tabs.map((tab, index) => <With 
                tag={`button`}
                key={`tab-label-${tabViewID}-${index}`} 
                className={`tab-label rel ${index === activeTab ? 'active' : ''}`.trim()} 
                onClick={() => {
                    handleTabClick(index)
                    tab.onSelect && tab.onSelect(index)
                }}>{tab.label}</With>)}
        </With>

        <With 
            className={`tab-content rel`}>
            <With className={`tabs-track flex aic`} style={{ transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)` }}>
            {tabs.map((tab, index) => {

                // const tabBodyRef = useRef<HTMLDivElement>(null);
                // const intersectionRatio = useIntersectionObserver(tabBodyRef, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
                // console.log(activeTab, index, 0, -((index+1) * size.width))
                return <With 
                // ref={tabBodyRef}
                key={`tab-body-${tabViewID}-${index}`} 
                className={`tab-body rel`} 
                style={{ 
                    width: size.width,
                    minWidth: size.width,
                    maxWidth: size.width,
                    opacity: index === activeTab ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                }}>{tab.body}</With>
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