import { forwardRef } from "react";
import { BaseProps } from "../types/interfaces";
import { ALERT } from "../types/enums";
import With from "./base";
import { dynamicObject } from "../types";

export interface AlertProps {
    type?: ALERT,
    icon?: string,
    iconSize?: number,
    message?: string,
    title: string,
    
}

export interface AlertHandler {
    open: () => void,
    close: () => void,
}

const Icons : dynamicObject = {
    [ALERT.Info]: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none">
        <path
            fill="#292D32"
            d="M21.56 10.738l-1.35-1.58c-.25-.3-.46-.86-.46-1.26v-1.7c0-1.06-.87-1.93-1.93-1.93h-1.7c-.4 0-.97-.21-1.27-.46l-1.58-1.35c-.69-.59-1.82-.59-2.51 0l-1.6 1.35c-.3.25-.86.46-1.26.46H6.17c-1.06 0-1.93.87-1.93 1.93v1.7c0 .39-.2.95-.45 1.25l-1.35 1.59c-.58.7-.58 1.82 0 2.5l1.35 1.59c.25.29.45.86.45 1.25v1.71c0 1.06.87 1.93 1.93 1.93h1.74c.39 0 .96.21 1.26.46l1.58 1.35c.69.59 1.82.59 2.51 0l1.58-1.35c.3-.25.86-.46 1.26-.46h1.7c1.06 0 1.93-.87 1.93-1.93v-1.7c0-.4.21-.96.46-1.26l1.35-1.58c.61-.68.61-1.81.02-2.51zm-10.31-2.61c0-.41.34-.75.75-.75s.75.34.75.75v4.83c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4.83zm.75 8.74c-.55 0-1-.45-1-1s.44-1 1-1c.55 0 1 .45 1 1s-.44 1-1 1z" />
    </svg>,
    [ALERT.Warning]: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none">
        <path
            fill="#292D32"
            d="M19.51 5.85l-5.94-3.43c-.97-.56-2.17-.56-3.15 0L4.49 5.85a3.15 3.15 0 00-1.57 2.73v6.84c0 1.12.6 2.16 1.57 2.73l5.94 3.43c.97.56 2.17.56 3.15 0l5.94-3.43a3.15 3.15 0 001.57-2.73V8.58a3.192 3.192 0 00-1.58-2.73zm-8.26 1.9c0-.41.34-.75.75-.75s.75.34.75.75V13c0 .41-.34.75-.75.75s-.75-.34-.75-.75V7.75zm1.67 8.88c-.05.12-.12.23-.21.33a.99.99 0 01-1.09.21c-.13-.05-.23-.12-.33-.21-.09-.1-.16-.21-.22-.33a.986.986 0 01-.07-.38c0-.26.1-.52.29-.71.1-.09.2-.16.33-.21.37-.16.81-.07 1.09.21.09.1.16.2.21.33.05.12.08.25.08.38s-.03.26-.08.38z" />
    </svg>,
    [ALERT.Error]: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>,
    [ALERT.Success]: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
}

const Alert = forwardRef<AlertHandler, AlertProps & BaseProps>((props, ref) => {
    
    const { type, icon, title, message, iconSize, ...rest } = props;

    return <With className={`--alert --${(type || ALERT.Info).toLowerCase()} flex aic`} {...rest}>
        <With className={`--icon icon-${icon || `auto-matic`}`} style={iconSize ? { width: iconSize, height: iconSize } : {}}>
            {!icon && Icons[type || ALERT.Info]}
        </With>
        <With className={`--meta flex cols`} tag={`h1`}>
            <With className={`--title ${message ? `--tm` : ``}`} tag={`h1`}>
                {title || `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
            </With>
            {message && <With className={`--message`} tag={`h2`}>{message}</With>}
        </With>
    </With>


})

export default Alert    