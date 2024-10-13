import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import With from "./base";
import { uuid } from "../funs";
import { useResizeObserver } from "../hooks";
import ComponentEditor from "./editor";
const TabView = forwardRef((props, ref) => {
    const { as, tabs, speed, ...rest } = props;
    const tabview = useRef(null);
    const tabViewID = useMemo(() => uuid(), []);
    const [activeTab, setActiveTab] = useState(0);
    const size = useResizeObserver(tabview);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    useEffect(() => {
    }, []);
    return _jsxs(_Fragment, { children: [_jsxs(With, { ref: tabview, className: `tabview flex cols`, ...rest, children: [_jsx(With, { className: `tab-head flex aic`, children: tabs.map((tab, index) => _jsx(With, { tag: `button`, className: `tab-label rel ${index === activeTab ? 'active' : ''}`.trim(), onClick: () => {
                                handleTabClick(index);
                                tab.onSelect && tab.onSelect(index);
                            }, children: tab.label }, `tab-label-${tabViewID}-${index}`)) }), _jsx(With, { className: `tab-content rel`, children: _jsx(With, { className: `tabs-track flex aic`, style: { transition: `all ${speed || 0.3}s ease-in-out 0s`, transform: `translate(-${activeTab * size.width}px, 0)` }, children: tabs.map((tab, index) => {
                                return _jsx(With, { className: `tab-body rel`, style: {
                                        width: size.width,
                                        minWidth: size.width,
                                        maxWidth: size.width,
                                        opacity: index === activeTab ? 1 : 0,
                                        transition: 'opacity 0.5s ease',
                                    }, children: tab.body }, `tab-body-${tabViewID}-${index}`);
                            }) }) })] }), props.editor && _jsx(ComponentEditor, { element: `.tabview`, title: `TabView`, attrs: {
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
                } })] });
});
export default TabView;
