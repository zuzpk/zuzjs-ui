import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import { nanoid } from "nanoid";

export interface ContextMenuItem {
    label: string;
    labelColor?: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    onSelect: () => void;
}

const ContextMenu = forwardRef<HTMLDivElement, { as?: string, items: ContextMenuItem[], animate?: animationProps } & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
    
    const { as, items, ...rest } = props;

    return <With 
        as={as} 
        className={`zuz-context-menu abs flex cols`}
        {...rest} 
        ref={ref} >
        {items.map((item : ContextMenuItem, index) => item.label == `-` ? <With as={`context-line`} key={`${index}-line`} /> :
         <With key={`item-${item.label.replace(/\s/g, `-`)}-${index}`} onClick={item.onSelect} as={`button`} className={`context-menu-item flex aic ${item.className || ``}`.trim()}>
            <With as={`div`} className={`ico icon-${item.icon}`.trim()} style={item.iconColor ? { color: item.iconColor } : {}} />
            <With as={`h1`} className={`flex aic`} style={item.labelColor ? { color: item.labelColor } : {}}>{item.label}</With>
        </With>)}
    </With>

});

export default ContextMenu