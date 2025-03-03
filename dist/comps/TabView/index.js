'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { uuid } from "../../funs";
import { useResizeObserver } from "../../hooks";
import Box from "../Box";
import TabItem from "./tab";
const TabView = forwardRef((props, ref) => {
    const { as, tabs: _tabs, speed, prerender, onChange, ...rest } = props;
    const tabs = useMemo(() => _tabs.reduce((ts, t) => {
        ts.push({
            ...t,
            key: t.key || uuid()
        });
        return ts;
    }, []), [_tabs]);
    const tabview = useRef(null);
    const tabViewID = useMemo(() => uuid(), []);
    const [activeTab, setActiveTab] = useState(0);
    const size = useResizeObserver(tabview);
    const render = useMemo(() => prerender == undefined || prerender == true ? true : false, []);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    useEffect(() => {
        onChange && onChange(tabs[0], 0);
    }, []);
    return _jsxs(Box, { ref: tabview, className: `--tabview flex cols`, children: [_jsx(Box, { className: `--head flex aic`, children: tabs.map((tab, index) => _jsx(TabItem, { tab: tab, index: index, activeTab: activeTab, onClick: idx => {
                        handleTabClick(idx);
                        tab.onSelect && tab.onSelect(tab, idx);
                        onChange && onChange(tab, idx);
                    } }, `tab-${tabViewID}-${tab.key || index}`)) }), _jsx(Box, { className: `--body rel`, children: _jsx(Box, { className: `--track flex aic`, style: {
                        transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)`
                    }, children: tabs.map((tab, index) => _jsx(Box, { style: {
                            width: size.width,
                            minWidth: size.width,
                            maxWidth: size.width,
                            opacity: index === activeTab ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                        }, className: `--content`, children: (render || activeTab == index) && tab.body })) }) })] });
});
export default TabView;
