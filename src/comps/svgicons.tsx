import { ALERT } from "../types/enums"

const SVGIcons = {
    colorSchemeLight: <svg width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        color="currentcolor" shapeRendering="geometricPrecision" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    colorSchemeSystem: <svg width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        color="currentcolor" shapeRendering="geometricPrecision" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" ry="2" /><path d="M8 21h8M12 17v4" /></svg>,
    colorSchemeDark: <svg width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        color="currentcolor" shapeRendering="geometricPrecision" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79" /></svg>,
    arrowDown: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path d="M17.919 8.18H6.079c-.96 0-1.44 1.16-.76 1.84l5.18 5.18c.83.83 2.18.83 3.01 0l1.97-1.97 3.21-3.21c.67-.68.19-1.84-.77-1.84z" />
    </svg>,
    arrowUp: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path d="M18.68 13.978l-3.21-3.21-1.96-1.97a2.13 2.13 0 00-3.01 0l-5.18 5.18c-.68.68-.19 1.84.76 1.84h11.84c.96 0 1.44-1.16.76-1.84z" />
    </svg>,
    search: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34">
        <path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" />
    </svg>,
    close: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>,
    eye: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#333" d="M12 20.5c-4.299 0-8.24-3.023-10.544-8.086a1 1 0 010-.828C3.759 6.523 7.701 3.5 12 3.5s8.24 3.023 10.544 8.086a1.001 1.001 0 010 .828 18.14 18.14 0 01-1.391 2.52 1 1 0 11-1.666-1.106A15.87 15.87 0 0020.529 12C18.543 7.92 15.379 5.5 12 5.5S5.457 7.92 3.471 12c1.986 4.08 5.15 6.5 8.529 6.5a7.964 7.964 0 005.036-1.92 1 1 0 111.265 1.55A9.94 9.94 0 0112 20.5z" />
        <path fill="#333" d="M12 16a4.004 4.004 0 01-3.929-4.756 1 1 0 011.965.375A2 2 0 1014 12a2.034 2.034 0 00-2.053-1.999 1.04 1.04 0 01-1.043-.947.963.963 0 01.902-1.05L12 8a4 4 0 010 8z" />
    </svg>,
    eyeSlash: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#333" d="M12 15c-4.132 0-7.98-1.214-10.294-3.249a1 1 0 111.32-1.502C4.986 11.972 8.34 13 12 13s7.014-1.028 8.974-2.751a1 1 0 111.32 1.502C19.98 13.786 16.132 15 12 15z" />
        <path fill="#333" d="M12 18a1 1 0 01-1-1v-3a1 1 0 012 0v3a1 1 0 01-1 1zM7.749 17.667a.964.964 0 01-.17-.014 1 1 0 01-.817-1.155l.505-2.935a1 1 0 111.97.339l-.504 2.935a1 1 0 01-.984.83zM3.636 16.306a1.001 1.001 0 01-.942-1.336l.978-2.745a1 1 0 111.884.672l-.978 2.745a1 1 0 01-.942.664zM16.251 17.667a1 1 0 01-.984-.83l-.505-2.935a1 1 0 011.97-.339l.506 2.935a1 1 0 01-.816 1.155.964.964 0 01-.17.014zM20.364 16.306a1 1 0 01-.942-.664l-.978-2.745a1 1 0 111.884-.672l.978 2.745a1.001 1.001 0 01-.942 1.336z" />
    </svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /> </svg>,
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
    </svg>,
    

    //Editor
    layers: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M19.3697 4.89109L13.5097 2.28109C12.6497 1.90109 11.3497 1.90109 10.4897 2.28109L4.62969 4.89109C3.14969 5.55109 2.92969 6.45109 2.92969 6.93109C2.92969 7.41109 3.14969 8.31109 4.62969 8.97109L10.4897 11.5811C10.9197 11.7711 11.4597 11.8711 11.9997 11.8711C12.5397 11.8711 13.0797 11.7711 13.5097 11.5811L19.3697 8.97109C20.8497 8.31109 21.0697 7.41109 21.0697 6.93109C21.0697 6.45109 20.8597 5.55109 19.3697 4.89109Z" fill="#292D32"></path><path d="M12.0003 17.04C11.6203 17.04 11.2403 16.96 10.8903 16.81L4.15031 13.81C3.12031 13.35 2.32031 12.12 2.32031 10.99C2.32031 10.58 2.65031 10.25 3.06031 10.25C3.47031 10.25 3.80031 10.58 3.80031 10.99C3.80031 11.53 4.25031 12.23 4.75031 12.45L11.4903 15.45C11.8103 15.59 12.1803 15.59 12.5003 15.45L19.2403 12.45C19.7403 12.23 20.1903 11.54 20.1903 10.99C20.1903 10.58 20.5203 10.25 20.9303 10.25C21.3403 10.25 21.6703 10.58 21.6703 10.99C21.6703 12.11 20.8703 13.35 19.8403 13.81L13.1003 16.81C12.7603 16.96 12.3803 17.04 12.0003 17.04Z" fill="#292D32"></path><path d="M12.0003 22.0009C11.6203 22.0009 11.2403 21.9209 10.8903 21.7709L4.15031 18.7709C3.04031 18.2809 2.32031 17.1709 2.32031 15.9509C2.32031 15.5409 2.65031 15.2109 3.06031 15.2109C3.47031 15.2109 3.80031 15.5409 3.80031 15.9509C3.80031 16.5809 4.17031 17.1509 4.75031 17.4109L11.4903 20.4109C11.8103 20.5509 12.1803 20.5509 12.5003 20.4109L19.2403 17.4109C19.8103 17.1609 20.1903 16.5809 20.1903 15.9509C20.1903 15.5409 20.5203 15.2109 20.9303 15.2109C21.3403 15.2109 21.6703 15.5409 21.6703 15.9509C21.6703 17.1709 20.9503 18.2709 19.8403 18.7709L13.1003 21.7709C12.7603 21.9209 12.3803 22.0009 12.0003 22.0009Z" fill="#292D32" /></svg>,
    play: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>,
    pause: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5z" /></svg>,
    next: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m6 18 8.5-6L6 6zM16 6v12h2V6z" /></svg>,
    prev: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>,
    plus: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M28 14H18V4a2 2 0 0 0-4 0v10H4a2 2 0 0 0 0 4h10v10a2 2 0 0 0 4 0V18h10a2 2 0 0 0 0-4" /></svg>,
    add: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m4 10.75h-3.25V16c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.25H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3.25V8c0-.41.34-.75.75-.75s.75.34.75.75v3.25H16c.41 0 .75.34.75.75s-.34.75-.75.75" />
    </svg>,
    chevronUp: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="m7 14 5-5 5 5z" /></svg>,
    chevronBottom: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5z" /></svg>,
    chevronRight: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="m10 17 5-5-5-5v10z" /></svg>,
    chevronLeft: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="m14 7-5 5 5 5V7z" /></svg>,
    chevronRightOutline: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>,
    chevronLeftOutline: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" /></svg>,
    chevronUpOutline: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" /></svg>,
    chevronDownOutline: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>,
    bezier: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M19.14 7.72C19.43 8.47 20.15 9 21 9C22.1 9 23 8.1 23 7C23 5.9 22.1 5 21 5C20.15 5 19.43 5.53 19.14 6.28C19.09 6.27 19.05 6.25 19 6.25H15V5.5C15 4.68 14.32 4 13.5 4H10.5C9.68 4 9 4.68 9 5.5V6.25H5C4.95 6.25 4.91 6.27 4.86 6.28C4.57 5.53 3.85 5 3 5C1.9 5 1 5.9 1 7C1 8.1 1.9 9 3 9C3.85 9 4.57 8.47 4.86 7.72C4.91 7.73 4.95 7.75 5 7.75H7.57C5.52 9.27 4.25 11.79 4.25 14.5C4.25 14.67 4.26 14.83 4.28 15H4C3.17 15 2.5 15.67 2.5 16.5V18.5C2.5 19.33 3.17 20 4 20H6C6.22 20 6.42 19.95 6.61 19.86C7.13 19.64 7.5 19.11 7.5 18.5V16.5C7.5 15.67 6.83 15 6 15H5.77C5.77 14.97 5.78 14.94 5.78 14.91C5.76 14.77 5.76 14.64 5.76 14.5C5.76 12.03 7.03 9.77 9.02 8.6C9.06 9.37 9.71 10 10.5 10H13.5C14.29 10 14.94 9.37 14.99 8.6C16.98 9.77 18.25 12.04 18.25 14.5C18.25 14.64 18.24 14.77 18.23 14.91C18.23 14.94 18.24 14.97 18.24 15H18C17.17 15 16.5 15.67 16.5 16.5V18.5C16.5 19.11 16.87 19.64 17.39 19.86C17.58 19.95 17.78 20 18 20H20C20.83 20 21.5 19.33 21.5 18.5V16.5C21.5 15.67 20.83 15 20 15H19.72C19.74 14.83 19.75 14.67 19.75 14.5C19.75 11.79 18.48 9.27 16.43 7.75H19C19.05 7.75 19.09 7.73 19.14 7.72Z" fill="#292D32" /></svg>,
    mouse: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M13.2978 2.11468C13.0064 2.06339 12.75 2.29593 12.75 2.59185V5.45262C12.75 5.65098 12.8709 5.82564 13.0359 5.93583C13.5391 6.27202 13.87 6.84597 13.87 7.49906V9.49906C13.87 10.5291 13.03 11.3791 12 11.3791C10.96 11.3791 10.12 10.5291 10.12 9.49906V7.49906C10.12 6.84578 10.4583 6.27168 10.9639 5.93554C11.1291 5.82572 11.25 5.65098 11.25 5.45262V2.59249C11.25 2.29634 10.9935 2.0637 10.7019 2.11513C9.15243 2.38834 7.76579 3.13327 6.7 4.19906C5.34 5.55906 4.5 7.43906 4.5 9.49906V14.4991C4.5 18.6291 7.87 21.9991 12 21.9991C16.13 21.9991 19.5 18.6291 19.5 14.4991V9.49906C19.5 5.80857 16.813 2.73328 13.2978 2.11468Z" fill="#292D32" /></svg>,
    addKey: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M20.9498 14.55L14.5598 20.94C13.1598 22.34 10.8598 22.34 9.44977 20.94L3.05977 14.55C1.65977 13.15 1.65977 10.85 3.05977 9.44L9.44977 3.05C10.8498 1.65 13.1498 1.65 14.5598 3.05L20.9498 9.44C22.3498 10.85 22.3498 13.15 20.9498 14.55Z" fill="#292D32" /></svg>,
    // animation: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <path fill="#292D32" d="m15.39 5.211 1.41 2.82c.19.39.7.76 1.13.84l2.55.42c1.63.27 2.01 1.45.84 2.63l-1.99 1.99c-.33.33-.52.98-.41 1.45l.57 2.46c.45 1.94-.59 2.7-2.3 1.68l-2.39-1.42c-.43-.26-1.15-.26-1.58 0l-2.39 1.42c-1.71 1.01-2.75.26-2.3-1.68l.57-2.46c.09-.48-.1-1.13-.43-1.46l-1.99-1.99c-1.17-1.17-.79-2.35.84-2.63l2.55-.42c.43-.07.94-.45 1.13-.84l1.41-2.82c.77-1.52 2.01-1.52 2.78.01M8 5.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75M5 19.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75M3 12.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1c.41 0 .75.34.75.75s-.34.75-.75.75" />
    // </svg>,
    // style: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <path fill="#292D32" d="M21.3 7.58h-5.58c-.39 0-.7-.31-.7-.7s.31-.7.7-.7h5.58c.39 0 .7.31.7.7s-.31.7-.7.7M6.42 7.58H2.7c-.39 0-.7-.31-.7-.7s.31-.7.7-.7h3.72c.39 0 .7.31.7.7s-.32.7-.7.7" />
    //     <path fill="#292D32" d="M10.14 10.83a3.95 3.95 0 1 0 0-7.9 3.95 3.95 0 0 0 0 7.9M21.3 17.81h-3.72c-.39 0-.7-.31-.7-.7s.31-.7.7-.7h3.72c.39 0 .7.31.7.7s-.31.7-.7.7M8.28 17.81H2.7c-.39 0-.7-.31-.7-.7s.31-.7.7-.7h5.58c.39 0 .7.31.7.7s-.32.7-.7.7" />
    //     <path fill="#292D32" d="M13.86 21.072a3.95 3.95 0 1 0 0-7.9 3.95 3.95 0 0 0 0 7.9" />
    // </svg>,
    // play: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <path fill="#292D32" d="M11.969 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.47-10-10-10m3 12.23-2.9 1.67a2.28 2.28 0 0 1-2.3 0 2.29 2.29 0 0 1-1.15-2v-3.35c0-.83.43-1.58 1.15-2s1.58-.42 2.31 0l2.9 1.67c.72.42 1.15 1.16 1.15 2s-.43 1.59-1.16 2.01" />
    // </svg>,
    // pause: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <path fill="#292D32" d="M10.65 19.11V4.89c0-1.35-.57-1.89-2.01-1.89H5.01C3.57 3 3 3.54 3 4.89v14.22C3 20.46 3.57 21 5.01 21h3.63c1.44 0 2.01-.54 2.01-1.89M21.002 19.11V4.89c0-1.35-.57-1.89-2.01-1.89h-3.63c-1.43 0-2.01.54-2.01 1.89v14.22c0 1.35.57 1.89 2.01 1.89h3.63c1.44 0 2.01-.54 2.01-1.89" />
    // </svg>,
    // mouse: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <path fill="#292D32" d="M21 7.52v5.88c0 .34-.33.58-.65.48l-3.93-1.22a3.02 3.02 0 0 0-3.78 3.79l1.21 3.9c.1.32-.14.65-.48.65H7.52C4.07 21 2 18.94 2 15.48V7.52C2 4.06 4.07 2 7.52 2h7.96C18.93 2 21 4.06 21 7.52" />
    //     <path fill="#292D32" d="m21.96 18.839-1.63.55c-.45.15-.81.5-.96.96l-.55 1.63c-.47 1.41-2.45 1.38-2.89-.03l-1.85-5.95c-.36-1.18.73-2.28 1.9-1.91l5.96 1.85c1.4.44 1.42 2.43.02 2.9" />
    // </svg>,
    

}

export default SVGIcons