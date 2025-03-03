"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { SelectTabs } from "../..";
import { uuid } from "../../funs";
import { useBase, useResizeObserver } from "../../hooks";
import Box from "../Box";
import TabBody from "./body";
const TabView = forwardRef((props, ref) => {
    const { tabs: _tabs, speed, prerender, variant, onChange, ...rest } = props;
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
    const { style, className } = useBase(rest);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    useEffect(() => {
        onChange && onChange(tabs[0], 0);
    }, []);
    return _jsxs(Box, { ref: tabview, style: style, className: `--tabview --${variant || "default"} flex cols ${className}`, children: [_jsx(SelectTabs, { as: `--tabview-head`, onSwitch: (segment) => {
                    handleTabClick(segment.index);
                    const tab = tabs.find((t) => t.tag == segment.tag);
                    if (tab && tab.onSelect) {
                        tab.onSelect(tab, segment.index);
                        onChange && onChange(tab, segment.index);
                    }
                }, selected: activeTab, items: tabs.reduce((arr, c, index) => {
                    arr.push({
                        icon: c.icon,
                        index,
                        label: c.label,
                        tag: c.tag
                    });
                    return arr;
                }, []) }), _jsx(Box, { className: `--tabview-body rel`, children: _jsx(Box, { className: `--track flex aic`, style: {
                        transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)`
                    }, children: tabs.map((tab, index) => _jsx(TabBody, { index: index, active: index === activeTab, size: size, render: render, content: tab.body }, `tab-body-${tab.key || index}-${tabViewID}`)) }) })] });
});
export default TabView;
