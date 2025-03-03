import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useDelayed } from "../../hooks";
import { CHECKBOX, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import Box from "../Box";
import CheckBox from "../CheckBox";
import TColumn from "./col";
const TRow = (props) => {
    const { index, pubsub, schema, data, ids, styles, animate, sortBy, selectable, tableRef, rowClassName, onSort, onSelect, onContextMenu } = props;
    const mounted = useDelayed();
    const _animation = useMemo(() => ({
        transition: TRANSITIONS.SlideInBottom,
        curve: TRANSITION_CURVES.EaseInOut,
        delay: .02 * (index + 1),
    }), []);
    const checkbox = useRef(null);
    const handleSelector = (chk, id) => {
        if (index == -1) {
            pubsub.emit(`ALL_ROWS_${chk ? `CHECKED` : `UNCHECKED`}`, chk);
        }
        else {
            if (onSelect)
                onSelect(data, chk);
            pubsub.emit(`ROW_${chk ? `CHECKED` : `UNCHECKED`}`, chk, id);
        }
    };
    const Selector = (idx, id, value) => _jsx(TColumn, { idx: idx, id: id, as: `--selector`, pubsub: pubsub, value: _jsx(CheckBox, { value: value, ref: checkbox, 
            // checked={checked || false} 
            onSwitch: handleSelector, type: CHECKBOX.Default }) });
    useEffect(() => {
        const onRowChecked = (mod, id) => {
            checkbox.current?.setChecked(mod, false);
        };
        const onRowUnchecked = (mod, id) => {
            let anyChecked = false;
            if (tableRef?.current) {
                // tableRef.current.querySelectorAll(`.--selector input[type=checkbox]`).forEach((e) => {
                tableRef.current.querySelectorAll(`.--row`).forEach((e) => {
                    const _row = e;
                    if (!_row.classList.contains(`--row-head`)) {
                        const _checkbox = _row.querySelector(`.--selector input[type=checkbox]`);
                        if (_checkbox && _checkbox.checked && !anyChecked)
                            anyChecked = _checkbox.checked;
                    }
                });
            }
            checkbox.current.setChecked(anyChecked, false);
        };
        const onAllRowsChecked = (mod) => {
            checkbox.current?.setChecked(mod, false);
            if (onSelect)
                onSelect(data, mod);
        };
        const onAllRowsUnchecked = (mod) => {
            checkbox.current?.setChecked(mod, false);
            if (onSelect)
                onSelect(data, mod);
        };
        if (index == -1) {
            pubsub.on(`ROW_CHECKED`, onRowChecked);
            pubsub.on(`ROW_UNCHECKED`, onRowUnchecked);
            return () => {
                pubsub.off(`ROW_CHECKED`, onRowChecked);
                pubsub.off(`ROW_UNCHECKED`, onRowUnchecked);
            };
        }
        else {
            pubsub.on(`ALL_ROWS_CHECKED`, onAllRowsChecked);
            pubsub.on(`ALL_ROWS_UNCHECKED`, onAllRowsUnchecked);
            return () => {
                pubsub.off(`ALL_ROWS_CHECKED`, onAllRowsChecked);
                pubsub.off(`ALL_ROWS_UNCHECKED`, onAllRowsUnchecked);
            };
        }
    }, []);
    return _jsxs(Box, { onContextMenu: e => onContextMenu ? onContextMenu(e, data) : null, "data-index": index, ...(animate ? { animate: { ..._animation, when: mounted } } : {}), as: `--row flex aic ${index == -1 ? `--row-head` : ``} ${rowClassName || ``}`, children: [index == -1 && schema.map((c, i) => {
                const { renderWhenHeader, render, value, ...cc } = c;
                return _jsxs(Fragment, { children: [selectable && i == 0 && Selector(-1, `--selector-${c.id}`, `all`), _jsx(TColumn, { idx: -1, onSort: onSort, sortBy: sortBy, 
                            // value={renderWhenHeader && render ? render!(index == -1 ? c as dynamicObject : data as T, index) : value as string} 
                            value: value, ...cc, pubsub: pubsub, style: styles[c.id] })] }, `--col-${c.id}`);
            }), index > -1 && ids && data && schema.map((c, i) => {
                return _jsxs(Fragment, { children: [selectable && i == 0 && Selector(i, `--selector-${c.id}`, c.id.toString()), ids.includes(String(c.id)) ? _jsx(TColumn, { pubsub: pubsub, idx: i, id: String(c.id), style: styles[String(c.id)], value: c.render ? c.render(data, index) : data[String(c.id).includes(`.`) ? String(c.id).split(`.`).reverse()[0] : c.id] }) : null] }, `--${String(c.id)}-val-${i}`);
            })] });
};
export default TRow;
