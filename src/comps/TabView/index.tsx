"use client"
import { uuid } from "@zuzjs/core";
import { useResizeObserver } from "@zuzjs/hooks";
import { Ref, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import Segmented from "../Segmented";
import { Segment } from "../Segmented/types";
import TabBody from "./body";
import { TabViewHandler, TabViewProps } from "./types";


// const TabView = forwardRef<TabViewHandler, TabViewProps>((props, ref) => {
/**
 * TabView component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TabView tabs={[{ label: "Tab 1", content: "Content 1" }]} onChange={(active) => console.log(active)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TabView tabs={[{ label: "Tab 1", content: "Content 1" }, { label: "Tab 2", content: "Content 2" }]} defaultActive={0} />
 * ```
 * @param tabs - tabs prop
 * @param onChange - Callback function triggered when value changes
 * @param defaultActive - defaultActive prop
 */
const TabView = ({
    ref,
    ...props
} : TabViewProps & {
    ref? : Ref<TabViewHandler>
}) => {
    
    const { 
        tabs: _tabs, 
        speed = 0.3, 
        prerender = true,
        variant,
        tabStyle = `fixed`, 
        onChange,
        transitionType = "slide",
        height,
        defaultActive = 0,
        ...rest 
    } = props;

    const [activeTab, setActiveTab] = useState(() => {
        if (!_tabs.length) return 0
        return Math.min(Math.max(defaultActive, 0), _tabs.length - 1)
    });
    const [tabHeights, setTabHeights] = useState<Record<number, number>>({});
    const tabview = useRef<HTMLDivElement>(null)
    const size = useResizeObserver(tabview)
    const tabViewID = useMemo(() => uuid(8), [])
    const hasMeasured = useMemo(() => size.width > 0, [size.width]);

    useImperativeHandle(ref, () => ({
        setTab: (index: number) => setActiveTab(index)
    }))

    const tabs = useMemo(() => _tabs.map(t => ({
        ...t,
        key: t.key || uuid(8),
    })), [_tabs])

    const { 
        style, 
        className, 
        rest: baseRest 
    } = useBase({
        as: `flex cols w-full no-overflow ${rest.as || ""}`,
        ...rest
    });

    const setTabHeight = useCallback((index: number, measuredHeight: number) => {
        setTabHeights((current) => current[index] === measuredHeight ? current : { ...current, [index]: measuredHeight });
    }, []);
    const tabBodyHeight = height === "fit-content"
        ? tabHeights[activeTab]
        : height === "max-content"
            ? Math.max(0, ...Object.values(tabHeights))
            : undefined;

    const getTrackStyle = () => {

        switch (transitionType) {
            case "fade":
            case "scale":
                return { display: 'grid', gridTemplateColumns: '1fr', width: `100%` };
            default: // slide
                return { 
                    width: `${tabs.length * 100}%`,
                    alignItems: 'flex-start',
                    display: 'flex', 
                    transform: `translate3d(-${activeTab * size.width}px, 0, 0)`,
                    transition: hasMeasured ? `transform ${speed}s cubic-bezier(0.4, 0, 0.2, 1)` : 'none'
                };
        }
    };

    return <Box
        ref={tabview}
        style={style}
        className={`--tabview --${tabStyle} flex cols ${className}`}>
        
        <Segmented
            as={`--tabview-head`}
            variant={variant}
            onSwitch={(segment: Segment) => {
                const index = segment.index ?? tabs.findIndex((t) => t.tag === segment.tag)
                if (index < 0) return
                setActiveTab(index)
                const tab = tabs[index]
                if (!tab) return
                tab.onSelect?.(tab, index)
                onChange?.(tab, index)
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

        <Box 
            className={`--tabview-body`} 
            style={{
                display: 'grid',
                gridTemplateRows: tabBodyHeight === undefined ? (hasMeasured ? '1fr' : '0fr') : 'auto',
                height: tabBodyHeight === undefined ? undefined : `${tabBodyHeight}px`,
                transition: hasMeasured
                    ? `height ${speed}s cubic-bezier(0.4, 0, 0.2, 1), grid-template-rows ${speed}s cubic-bezier(0.4, 0, 0.2, 1)`
                    : 'none',
                overflow: 'hidden',
            }}>
            <Box style={{ overflow: 'hidden', position: 'relative' }}>
            <Box 
                className={`--track`}
                style={{
                    ...getTrackStyle(),
                }}>
                {tabs.map((tab, index) => <TabBody 
                        key={`tab-body-${tab.key || index}-${tabViewID}`}
                        isActive={index === activeTab}
                        transitionType={transitionType}
                        speed={speed}
                        width={size.width}
                        render={prerender || index === activeTab}
                        index={index}
                        onHeightChange={setTabHeight}
                        content={tab.body}
                    />)}
            </Box>
            </Box>
        </Box>

    </Box>

}

TabView.displayName = `Zuz.TabView`

export default TabView