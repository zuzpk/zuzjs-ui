import * as react from 'react';
import react__default, { ElementType, ComponentPropsWithoutRef, Ref, ReactNode, MouseEvent as MouseEvent$1, RefObject, FC, CSSProperties, FormEventHandler, JSX, HTMLAttributes, ComponentPropsWithRef } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _zuzjs_hooks from '@zuzjs/hooks';
import { LineChartProps, Command } from '@zuzjs/hooks';
import { PubSub } from '@zuzjs/core';

/**
 * Converts a "const object" into a union of its values.
 * Equivalent to: typeof Obj[keyof typeof Obj]
 */
type ValueOf<T> = T[keyof T];
type dynamic = {
    [x: string]: any;
};
type Props<T extends ElementType> = ZuzProps & Omit<ComponentPropsWithoutRef<T>, keyof ZuzProps>;
type FormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

declare const AVATAR: {
    readonly Circle: "CIRCLE";
    readonly Square: "SQUARE";
};
declare const SKELETON: {
    readonly Default: "DEFAULT";
    readonly Circle: "CIRCLE";
};
declare const COLORTHEME: {
    readonly Light: "light";
    readonly Dark: "dark";
    readonly System: "system";
};
declare const CHECKBOX: {
    readonly Default: "DEFAULT";
    readonly Switch: "SWITCH";
};
declare const POSITION: {
    readonly Auto: "auto";
    readonly Top: "top";
    readonly Bottom: "bottom";
    readonly Left: "left";
    readonly Right: "right";
};
declare const Position: {
    readonly Auto: "auto";
    readonly Top: "top";
    readonly Bottom: "bottom";
    readonly Left: "left";
    readonly Right: "right";
};
declare const ORIGIN: {
    readonly TopLeft: "top left";
    readonly TopRight: "top right";
    readonly TopCenter: "top center";
    readonly BottomLeft: "bottom left";
    readonly BottomRight: "bottom right";
};
declare const OriginType: {
    readonly TopLeft: "top left";
    readonly TopRight: "top right";
    readonly TopCenter: "top center";
    readonly BottomLeft: "bottom left";
    readonly BottomRight: "bottom right";
};
declare const Variant: {
    readonly XSmall: "xs";
    readonly Small: "sm";
    readonly Medium: "md";
    readonly Large: "lg";
    readonly XLarge: "xl";
};
declare const SORT: {
    readonly Asc: "ASC";
    readonly Desc: "DESC";
};
declare const DATATYPE: {
    readonly String: "STRING";
    readonly Number: "NUMBER";
    readonly Boolean: "BOOLEAN";
    readonly Array: "ARRAY";
    readonly Object: "OBJECT";
    readonly Date: "DATE";
    readonly Time: "TIME";
    readonly DateTime: "DATETIME";
    readonly File: "FILE";
};
declare const FORMVALIDATION_STYLE: {
    readonly Dots: "DOTS";
};
declare const FORMVALIDATION: {
    readonly IPV4: "IPV4";
    readonly IPV6: "IPV6";
    readonly Email: "EMAIL";
    readonly Uri: "URI";
    readonly Password: "PASSWORD";
    readonly MatchField: "MATCHFIELD";
    readonly Pattern: "*";
    readonly GreaterThan: "GREATER_THAN";
};
declare const ALERT: {
    readonly Success: "success";
    readonly Error: "error";
    readonly Warning: "warning";
    readonly Info: "info";
};
declare const TRANSITION_CURVES: {
    readonly Spring: "SPRING";
    readonly Liquid: "LIQUID";
    readonly EaseInOut: "EASEINOUT";
    readonly EaseOutBack: "EASEOUTBACK";
    readonly Bounce: "BOUNCE";
};
declare const TRANSITIONS: {
    readonly FadeIn: "FADE_IN";
    readonly ScaleIn: "SCALE_IN";
    readonly SlideInTop: "SLIDE_FROM_TOP";
    readonly SlideInRight: "SLIDE_FROM_RIGHT";
    readonly SlideInBottom: "SLIDE_FROM_BOTTOM";
    readonly SlideInLeft: "SLIDE_FROM_LEFT";
};
declare const Status: {
    readonly Success: "success";
    readonly Error: "error";
    readonly Idle: "idle";
    readonly Dead: "dead";
};
declare const SHEET: {
    readonly Dialog: "DIALOG";
    readonly Default: "DEFAULT";
    readonly Error: "ERROR";
    readonly Success: "SUCCESS";
    readonly Warn: "WARN";
    readonly Promise: "PROMISE";
};
declare const DIALOG: {
    readonly Dialog: "DIALOG";
    readonly Default: "DEFAULT";
    readonly Error: "ERROR";
    readonly Success: "SUCCESS";
    readonly Warn: "WARN";
    readonly Promise: "PROMISE";
};
declare const SHEET_ACTION_POSITION: {
    readonly Left: "LEFT";
    readonly Right: "RIGHT";
    readonly Center: "CENTER";
};
declare const DIALOG_ACTION_POSITION: {
    readonly Left: "LEFT";
    readonly Right: "RIGHT";
    readonly Center: "CENTER";
};
declare const PROGRESS: {
    readonly Bar: "BAR";
    readonly Ring: "RING";
};
declare const SLIDER: {
    readonly Default: "range";
    readonly Text: "number";
};
declare const RADIO: {
    readonly Default: "DEFAULT";
    readonly Card: "CARD";
};
declare const FILTER: {
    readonly Gooey: "gooey";
};
declare const DRAWER_SIDE: {
    readonly Left: "LEFT";
    readonly Right: "RIGHT";
    readonly Top: "TOP";
    readonly Bottom: "BOTTOM";
};

declare const cssProps: dynamic;
declare const cssDirect: dynamic;

type DirectKeys = keyof typeof cssDirect;
type PropKeys = `${Extract<keyof typeof cssProps, string>}:`;
type ZuzCommonValues = DirectKeys | PropKeys;
type ZuzStyleString = ZuzCommonValues | (string & {});
type cssShortKey = keyof cssShortKeys;
type cssShortKeys = {
    w: string | number;
    minW: string | number;
    maxW: string | number;
    h: string | number;
    minH: string | number;
    maxH: string | number;
    x: string | number;
    y: string | number;
    z: string | number;
    r: string | number;
    rx: string | number;
    ry: string | number;
    rz: string | number;
    s: string | number;
    sx: string | number;
    sy: string | number;
    sz: string | number;
};

interface ZuzProps {
    /** CSS Styles, such as "w:100" for "width: 100px"; */
    as?: ZuzStyleString | ZuzStyleString[];
    /** Props to remove after processing so it won't appear in DOM */
    propsToRemove?: string[];
    /** Additional class names for styling the component */
    className?: string;
    /** Skeleton placeholder configuration using {@link Skeleton} */
    skeleton?: Skeleton;
    /** Animation configuration using {@link animationProps} */
    fx?: animationProps;
    transition?: ValueOf<typeof TRANSITIONS>;
}
interface BoxProps extends Partial<Props<`div`>> {
    name?: string;
    ref?: Ref<HTMLDivElement>;
}
interface parallaxEffectProps {
    lerpFactor?: number;
    x?: number;
    y?: number;
    multiplier?: number;
    xMultiplier?: number;
    yMultiplier?: number;
}
/**
 * `animationProps` defines the properties to control animation effects
 * applied to elements. Supports transitions with timing configurations.
 */
interface animationProps {
    /**
     * Specifies the type of transition to apply, based on predefined
     * {@link Transitions}
     */
    transition?: ValueOf<typeof TRANSITIONS>;
    /** This will be removed / added to default calculations for x, y */
    offset?: number;
    /** Starting style properties for the animation */
    from?: dynamic;
    /** Target style properties after the animation completes */
    to?: dynamic;
    /** Target style properties for exit animation */
    exit?: dynamic;
    /** Condition that determines when the animation should trigger */
    when?: boolean;
    /** Duration of the animation in milliseconds */
    duration?: number;
    /** Delay before the animation starts, in milliseconds */
    delay?: number;
    /** Easing curve applied to the animation, as a string or {@link TransitionCurves} */
    curve?: string | ValueOf<typeof TRANSITION_CURVES>;
    scroll?: parallaxEffectProps;
    mouse?: parallaxEffectProps;
    /** Clear fx on animation end */
    clearAtEnd?: boolean;
}
/**
 * `Skeleton` defines properties for a skeleton loader, used to indicate
 * loading states with placeholders.
 */
interface Skeleton {
    /**
     * Determines if the skeleton is enabled or disabled.
     * @example
     * enabled: true
     */
    enabled: boolean;
    /** Skeleton type, based on predefined {@link SKELETON} options
     * @example
     * type: SKELETON.CIRCLE
    */
    type?: ValueOf<typeof SKELETON>;
    /** General size of the skeleton, or can specify width/height separately
     * @example
     * size: 100 | 100px | 100%
    */
    size?: number | string;
    /** Default size of the skeleton if `size` is not specified
     * @default 100%
     * @example
     * defaultSize: 100 | 100px | 100%
    */
    defaultSize?: number | string;
    /** Width of the skeleton placeholder
     * @example
     * width: 100 | 100px | 100%
    */
    width?: number | string;
    /** Height of the skeleton placeholder
     * @example
     * height: 100 | 100px | 100%
    */
    height?: number | string;
    /** Border radius for the skeleton, allowing rounded corners */
    radius?: number | string;
}

type AccordionProps = BoxProps & {
    message?: string | ReactNode;
    title: string | ReactNode | ReactNode[];
};
interface AccordionHandler {
    open: () => void;
    close: () => void;
}

declare const Accordion: react.ForwardRefExoticComponent<Omit<AccordionProps, "ref"> & react.RefAttributes<AccordionHandler>>;

interface ActionBarHandler {
    show: () => void;
}
/**
 * Represents an item in the ActionBar.
 */
interface ActionBarItem {
    /** Specific tag for action item */
    tag?: string;
    /** The label of the action item */
    label: string;
    /** The icon to display for the action item */
    icon: ReactNode;
    /** The callback function to execute when the action item is clicked */
    onClick: () => void;
}
/**
 * Props for the ActionBar component.
 */
type ActionBarProps = BoxProps & {
    /** The index of the initially selected action item */
    selected?: number | string;
    /** Callback function to execute when an action item is clicked */
    onSwitch?: (tag: string) => void;
    /** Array of action items to display in the ActionBar */
    items: ActionBarItem[];
    /** Position of ActionBar */
    position?: ValueOf<typeof Position>;
};

/**
 * ActionBar renders a list of buttons with tooltips.
 *
 * @example
 * ```tsx
 * const items = [
 *   { label: 'Edit', icon: <EditIcon />, onClick: () => console.log('Edit clicked') },
 *   { label: 'Delete', icon: <DeleteIcon />, onClick: () => console.log('Delete clicked') }
 * ];
 *
 * <ActionBar items={items} />
 * ```
 */
declare const ActionBar: react.ForwardRefExoticComponent<Omit<ActionBarProps, "ref"> & react.RefAttributes<ActionBarHandler>>;

type AlertProps = BoxProps & {
    type?: ValueOf<typeof ALERT>;
    icon?: string;
    iconSize?: number;
    message?: string | ReactNode;
    title: string | ReactNode;
};
interface AlertHandler {
    open: () => void;
    close: () => void;
}

declare const Alert: react.ForwardRefExoticComponent<Omit<AlertProps, "ref"> & react.RefAttributes<AlertHandler>>;

type FormValidation = ValueOf<typeof FORMVALIDATION>;
type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>;
    numeric?: boolean;
    variant?: ValueOf<typeof Variant>;
    with?: FormValidation | `${FormValidation}${string}`;
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void;
};

type AutoCompleteProps = InputProps & {
    action?: string;
    data?: string[];
    withStyle?: string;
};

declare const AutoComplete: react.ForwardRefExoticComponent<Omit<AutoCompleteProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type AvatarProps = Props<"img"> & {
    type?: ValueOf<typeof AVATAR>;
    size?: number;
    variant?: ValueOf<typeof Variant>;
    src?: string;
    color?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
};
interface AvatarHandler {
}

declare const Avatar: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof AVATAR>;
    size?: number;
    variant?: ValueOf<typeof Variant>;
    src?: string;
    color?: string;
    crossOrigin?: "anonymous" | "use-credentials";
    referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
} & react.RefAttributes<AvatarHandler>>;

type BadgeProps = BoxProps & {
    size?: number;
    type?: ValueOf<typeof Status>;
    label?: string;
    loading?: boolean;
};
declare const Badge: react__default.FC<BadgeProps>;

declare const Box: {
    ({ ref, style, ...props }: BoxProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const SPINNER: {
    readonly Simple: "SIMPLE";
    readonly Roller: "ROLLER";
    readonly Wave: "Wave";
};
type SpinnerProps = BoxProps & {
    type?: ValueOf<typeof SPINNER>;
    variant?: ValueOf<typeof Variant> | number;
    width?: number;
    color?: string;
    background?: string;
    foreground?: string;
    speed?: number;
};

type ButtonProps = Props<`button`> & {
    ref?: Ref<HTMLButtonElement>;
    icon?: string | null;
    iconSize?: ValueOf<typeof Variant>;
    withLabel?: boolean;
    spinner?: typeof SPINNER[keyof typeof SPINNER];
    state?: ButtonState;
    variant?: ValueOf<typeof Variant>;
    reset?: boolean;
};
interface ButtonHandler extends HTMLButtonElement {
    reset: () => void;
    setState: (mod: ButtonState) => void;
}
declare const ButtonState: {
    Loading: string;
    Normal: string;
};
type ButtonState = typeof ButtonState[keyof typeof ButtonState];

declare const Button: {
    ({ ref, ...props }: ButtonProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type CalendarProps = {
    defaultValue?: Date | null;
    variant?: ValueOf<typeof Variant>;
    onChange: (date: Date | null) => void;
};

declare const Calendar: react.ForwardRefExoticComponent<CalendarProps & react.RefAttributes<HTMLInputElement>>;

declare enum CHART {
    Line = "line"
}
type ChartProps = BoxProps & LineChartProps & {
    type?: CHART;
    animDuration?: number;
    animDelay?: number;
};

declare const Chart: react.ForwardRefExoticComponent<Omit<ChartProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare enum BubbleStatus {
    Sending = 0,
    Sent = 1,
    Delivered = 2,
    Read = 3
}
declare enum BubbleMediaType {
    Image = "img",
    Video = "vid",
    Audio = "audio",
    Link = "link",
    Document = "doc",
    Location = "loc",
    Contact = "contact",
    Event = "event",
    Poll = "poll"
}
type BubbleProps = BoxProps & {
    text?: string;
    media?: {
        type: BubbleMediaType;
        source: string;
        duration?: string;
    };
    side?: "me" | "you";
    status?: BubbleStatus;
    timeStamp?: number;
    arrow?: boolean;
};

declare const Bubble: react.ForwardRefExoticComponent<Omit<BubbleProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

/**
 * Props for the CheckBox component.
 *
 * @typedef {Object} CheckBoxProps
 * @property {CHECKBOX} [type] - The type of the checkbox.
 * @property {Size} [size] - The size of the checkbox.
 * @property {(checked: boolean, value: string | number | readonly string[]) => void} [onChange] - Callback function triggered when the checkbox state changes.
 */
type CheckBoxProps = Props<"input"> & {
    type?: ValueOf<typeof CHECKBOX>;
    variant?: ValueOf<typeof Variant>;
    checked?: boolean;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
};
/**
 * Interface for handling checkbox state.
 *
 * @interface CheckboxHandler
 * @property {(mode: boolean, triggerChange?: boolean) => void} setChecked - Sets the checked state of the checkbox.
 * @property {(triggerChange?: boolean) => void} toggle - Toggles the checked state of the checkbox.
 */
interface CheckboxHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void;
    toggle: (triggerChange?: boolean) => void;
}

declare const CheckBox: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof CHECKBOX>;
    variant?: ValueOf<typeof Variant>;
    checked?: boolean;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & react.RefAttributes<CheckboxHandler>>;

interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>;
    code: string;
    lang?: 'typescript' | 'javascript' | 'tsx' | 'css' | 'json';
    showLines?: boolean;
    highlight?: string;
}

declare const CodeBlock: ({ ref, ...props }: CodeBlockProps) => react_jsx_runtime.JSX.Element;

/**
 * Individual segment in the `SelectTabs` component.
 * @typedef {Object} Segment
 * @property {number} index - The index of the segment.
 * @property {string} [icon] - The optional icon to display for the segment.
 * @property {string} [label] - The optional label to display for the segment.
 */
interface Segment {
    tag?: string | number;
    index: number;
    icon?: ReactNode;
    label?: ReactNode;
}
/**
 * Props for the `SelectTabs` component.
 * @typedef {Object} SegmentProps
 * @extends {Props<'div'>}
 * @property {number} [selected] - The index of the initially selected segment.
 * @property {Segment[]} items - Array of segments to display.
 */
type SegmentProps = BoxProps & {
    variant?: ValueOf<typeof Variant>;
    selected?: number;
    onSwitch?: (segment: Segment) => void;
    items: Segment[];
};
type SegmentItemProps = {
    meta: Segment;
    selected: boolean;
    onSelect: (index: number, width: number, x: number, segment: Segment, force: boolean) => void;
};
interface SegmentController {
    setSelected: (index: number) => void;
}

type ColorSchemeProps = Omit<SegmentProps, `items`> & {
    type?: "switch" | "toggle" | "system";
};

declare const ColorScheme$1: react.ForwardRefExoticComponent<Omit<ColorSchemeProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

interface ContextItem {
    label: string;
    labelColor?: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    enabled?: boolean;
    onSelect: () => void;
}
type ContextMenuProps = BoxProps & {
    id?: number;
    event?: MouseEvent$1<Element, MouseEvent> | TouchEvent;
    parent?: RefObject<HTMLElement | null>;
    origin?: ValueOf<typeof ORIGIN>;
    items?: ContextItem[];
    offsetX?: number;
    offsetY?: number;
    header?: ReactNode | FC;
    footer?: ReactNode | FC;
    when?: boolean;
    onClose?: (id: number) => void;
};
type MenuItemProps = ContextItem & {
    index: number;
    className: string;
};
interface ContextMenuHandler {
    show: (e: MouseEvent$1<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    hide: (e: MouseEvent$1 | TouchEvent) => void;
}

declare const ContextMenu: {
    ({ ref, ...props }: ContextMenuProps & {}): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type CookieConsentProps = {
    title?: string;
    message?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    position?: ValueOf<typeof Position>;
};

declare const CookiesConsent: react.ForwardRefExoticComponent<CookieConsentProps & react.RefAttributes<HTMLDivElement>>;

type CoverProps = BoxProps & {
    message?: string;
    spinner?: ValueOf<typeof SPINNER>;
    spinnerSize?: ValueOf<typeof Variant>;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
};
declare const Cover: react.ForwardRefExoticComponent<Omit<CoverProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare enum CropShape {
    Circle = "circle",
    Square = "square"
}
type CropperProps = BoxProps & {
    src: string;
    shape?: CropShape;
    size?: number;
};
interface CropHandler {
    getCropped: () => string;
    setScale: (scale: number) => void;
}

declare const Cropper: react.ForwardRefExoticComponent<Omit<CropperProps, "ref"> & react.RefAttributes<CropHandler>>;

type CrumbItem = {
    ID?: string;
    label: string;
    icon?: string | ReactNode;
    action?: () => void;
};
type CrumbProps = BoxProps & {
    items: CrumbItem[] | string;
    maxItems?: number;
    /** Base Path to be included when items is string */
    basePath?: string;
};

declare const Crumb: react.ForwardRefExoticComponent<Omit<CrumbProps, "ref"> & react.RefAttributes<HTMLOListElement | HTMLUListElement>>;

type DatePickerProps = InputProps & {
    icon?: ReactNode | string;
    defaultValue?: Date | null;
};

declare const DatePicker: react.ForwardRefExoticComponent<Omit<DatePickerProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type DialogProps = ZuzProps & {
    id?: number;
    title?: string | ReactNode;
    message?: string | ReactNode;
    transition?: ValueOf<typeof TRANSITIONS>;
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    speed?: number;
    delay?: number;
    type?: ValueOf<typeof DIALOG>;
    spinner?: ValueOf<typeof SPINNER>;
    loadingMessage?: string;
    action?: DialogActionHandler[];
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>;
    variant?: ValueOf<typeof Variant>;
    onShow?: () => void;
    onHide?: () => void;
};
interface DialogActionHandler {
    key?: string;
    label: string;
    handler?: () => void;
    onClick?: () => void;
}
interface DialogHandler {
    setLoading: (mode: boolean) => void;
    dialog: (title: string | ReactNode, message: string | ReactNode, action?: DialogActionHandler[], onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: ValueOf<typeof SHEET>) => void;
    success: (message: string | ReactNode, duration?: number) => void;
    error: (message: string | ReactNode, duration?: number) => void;
    warn: (message: string | ReactNode, duration?: number) => void;
    hide: () => void;
}

declare const Dialog: {
    ({ ref, ...props }: DialogProps & {
        index: number;
        onClose: (id: number) => void;
        ref?: Ref<DialogHandler>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type DrawerProps = BoxProps & {
    id?: number;
    index?: number;
    as?: string;
    speed?: number;
    from?: ValueOf<typeof DRAWER_SIDE>;
    children?: string | ReactNode | ReactNode[];
    prerender?: boolean;
    margin?: number;
    animation?: ValueOf<typeof TRANSITION_CURVES>;
    onClose?: (id: number) => void;
};
interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void;
    close: () => void;
}

declare const Drawer: {
    ({ ref, ...props }: DrawerProps & {
        ref?: Ref<HTMLDivElement>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const SVGIcons: {
    colorSchemeLight: react_jsx_runtime.JSX.Element;
    colorSchemeSystem: react_jsx_runtime.JSX.Element;
    colorSchemeDark: react_jsx_runtime.JSX.Element;
    arrowDown: react_jsx_runtime.JSX.Element;
    arrowUp: react_jsx_runtime.JSX.Element;
    search: react_jsx_runtime.JSX.Element;
    close: react_jsx_runtime.JSX.Element;
    eye: react_jsx_runtime.JSX.Element;
    eyeSlash: react_jsx_runtime.JSX.Element;
    check: react_jsx_runtime.JSX.Element;
    info: react_jsx_runtime.JSX.Element;
    warning: react_jsx_runtime.JSX.Element;
    error: react_jsx_runtime.JSX.Element;
    success: react_jsx_runtime.JSX.Element;
    layers: react_jsx_runtime.JSX.Element;
    play: react_jsx_runtime.JSX.Element;
    pause: react_jsx_runtime.JSX.Element;
    next: react_jsx_runtime.JSX.Element;
    prev: react_jsx_runtime.JSX.Element;
    plus: react_jsx_runtime.JSX.Element;
    add: react_jsx_runtime.JSX.Element;
    chevronUp: react_jsx_runtime.JSX.Element;
    chevronBottom: react_jsx_runtime.JSX.Element;
    chevronRight: react_jsx_runtime.JSX.Element;
    chevronLeft: react_jsx_runtime.JSX.Element;
    chevronRightOutline: react_jsx_runtime.JSX.Element;
    chevronLeftOutline: react_jsx_runtime.JSX.Element;
    chevronUpOutline: react_jsx_runtime.JSX.Element;
    chevronDownOutline: react_jsx_runtime.JSX.Element;
    bezier: react_jsx_runtime.JSX.Element;
    mouse: react_jsx_runtime.JSX.Element;
    addKey: react_jsx_runtime.JSX.Element;
    calendar: react_jsx_runtime.JSX.Element;
    done: react_jsx_runtime.JSX.Element;
    doneAll: react_jsx_runtime.JSX.Element;
    pending: react_jsx_runtime.JSX.Element;
};

type FabProps = Omit<ButtonProps, `icon`> & {
    icon?: string | keyof typeof SVGIcons;
    position?: ValueOf<typeof Position>;
};

declare const Fab: react.ForwardRefExoticComponent<Omit<FabProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

type FilterProps = {
    names?: ValueOf<typeof FILTER>[];
    strength?: number;
};
declare const Filters: {
    (props: FilterProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type SheetProps = ZuzProps & {
    title?: string;
    message?: string | ReactNode;
    transition?: ValueOf<typeof TRANSITIONS>;
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    speed?: number;
    type?: ValueOf<typeof SHEET>;
    spinner?: ValueOf<typeof SPINNER>;
    loadingMessage?: string;
    actionPosition?: ValueOf<typeof SHEET_ACTION_POSITION>;
    onShow?: () => void;
    onHide?: () => void;
};
interface SheetActionHandler {
    key?: string;
    label: string;
    handler?: () => void;
    onClick?: () => void;
}
interface SheetHandler {
    setLoading: (mode: boolean) => void;
    showDialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    dialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: ValueOf<typeof SHEET>) => void;
    success: (message: string | ReactNode, duration?: number) => void;
    error: (message: string | ReactNode, duration?: number) => void;
    warn: (message: string | ReactNode, duration?: number) => void;
    hide: () => void;
}
declare const Sheet: react.ForwardRefExoticComponent<ZuzProps & {
    title?: string;
    message?: string | ReactNode;
    transition?: ValueOf<typeof TRANSITIONS>;
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    speed?: number;
    type?: ValueOf<typeof SHEET>;
    spinner?: ValueOf<typeof SPINNER>;
    loadingMessage?: string;
    actionPosition?: ValueOf<typeof SHEET_ACTION_POSITION>;
    onShow?: () => void;
    onHide?: () => void;
} & react.RefAttributes<SheetHandler>>;

type FormProps = BoxProps & {
    /** Name of form, will be appended to --form-{name} in className
     * whitespace will be replaced with dash (-)
    */
    name?: string;
    /** The URL to which the form data is submitted */
    action?: string;
    /** List of error messages for form validation */
    errors?: dynamic;
    /** Spinner properties for loading indicator */
    spinner?: ValueOf<typeof SPINNER>;
    /** Additional data to include with form submission */
    withData?: dynamic;
    /** Handler function called before form submission with validated form data */
    beforeSubmit?: (data: FormData | dynamic) => void;
    /** Handler function called on form submission with validated form data */
    onSubmit?: (data: FormData | dynamic) => void;
    /** Callback triggered upon successful form submission */
    onSuccess?: (data: dynamic) => void;
    /** Callback triggered when form submission encounters an error */
    onError?: (error: any) => void;
    /** Cover properties to display loading or processing message */
    cover?: {
        /** Background color of the loading cover */
        color?: string;
        /** Message displayed during loading */
        message?: string;
    } | SheetHandler;
    resetOnSuccess?: boolean;
};
/**
 * Exposes control methods for the Form component, such as setting loading states or hiding errors.
 */
interface FormHandler {
    /** Sets the loading state of the form */
    setLoading: (mode: boolean) => void;
    /** Hides any currently displayed error message */
    hideError: () => void;
    /** Resets the form to its initial state */
    init: () => void;
    submit: () => void;
}

/**
 * {@link Form} is a controlled component designed to handle form data submission, validation, and display of loading or error states.
 * It allows for optional server-side submission through an action endpoint and customizable success/error handling callbacks.
 *
 * The component also provides an interface for controlling loading and error states from a parent component using {@link FormHandler}.
 *
 * @param props - Properties to configure form behavior, validation messages, submission handling, and visual feedback.
 * @param ref - Reference to the {@link FormHandler} interface, exposing methods to control loading and error states from the parent.
 */
declare const Form: react.ForwardRefExoticComponent<Omit<FormProps, "ref"> & react.RefAttributes<FormHandler>>;

type GroupProps = BoxProps & {
    fxDelay?: number;
    fxStep?: number;
    classToIgnore?: string;
};
declare const Group: react.ForwardRefExoticComponent<Omit<GroupProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type IconProps = Omit<BoxProps, `name`> & {
    ref?: Ref<HTMLDivElement>;
    name: string | ReactNode;
    pathCount?: number;
    variant?: ValueOf<typeof Variant>;
    color?: string;
};

declare const Icon: react.ForwardRefExoticComponent<Omit<IconProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type ImageProps = Props<`img`> & {};
declare const Image: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof ZuzProps> & react.RefAttributes<HTMLImageElement>>;

declare const Input: {
    ({ ref, ...props }: InputProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type KeyboardKey = "command" | "shift" | "ctrl" | "option" | "enter" | "delete" | "escape" | "tab" | "capslock" | "up" | "right" | "down" | "left" | "pageup" | "pagedown" | "home" | "end" | "help" | "space" | "fn" | "win" | "alt";
type KeyCombination = `${KeyboardKey}+${KeyboardKey | string}`;
declare const isKeyCombination: (value: KeyboardKey | KeyboardKey[] | KeyCombination) => value is KeyCombination;
declare const KeysMap: Record<KeyboardKey, string>;
declare const KeysLabelMap: Record<KeyboardKey, string>;
type KeyboardKeyProps = BoxProps & {
    keys: KeyboardKey | KeyboardKey[] | KeyCombination;
    children?: ReactNode;
    variant?: ValueOf<typeof Variant>;
};

declare const KeyBoardKeys: react.ForwardRefExoticComponent<Omit<KeyboardKeyProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type LabelProps = Props<`label`> & {};
declare const Label: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "ref">, keyof ZuzProps> & react.RefAttributes<HTMLLabelElement>>;

type ListItemObject = {
    icon?: ReactNode;
    label?: ReactNode;
    action?: ReactNode;
    className?: string;
    animate?: animationProps;
    onClick?: (event: any) => void;
};
type ListItem = Props<`li`> & (ReactNode | ListItemObject);
type ListProps = Props<`ul` | `ol`> & {
    variant?: ValueOf<typeof Variant>;
    items: ListItem[];
    direction?: "cols" | "rows";
    seperator?: ReactNode;
    ol?: boolean;
};

declare const List: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> | Omit<react.DetailedHTMLProps<react.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref">, keyof ZuzProps> & {
    variant?: ValueOf<typeof Variant>;
    items: ListItem[];
    direction?: "cols" | "rows";
    seperator?: react.ReactNode;
    ol?: boolean;
} & react.RefAttributes<HTMLOListElement | HTMLUListElement>>;

type NetworkManagerprops = BoxProps & {
    variant?: ValueOf<typeof Variant>;
    offlineMessage?: string;
    onlineMessage?: string;
};

declare const NetworkManager: react.ForwardRefExoticComponent<Omit<NetworkManagerprops, "ref"> & react.RefAttributes<HTMLDivElement>>;

type OverlayProps = BoxProps & {
    when?: boolean;
};
declare const Overlay: react.ForwardRefExoticComponent<Omit<OverlayProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare enum PaginationStyle {
    Table = "table",
    Gooey = "gooey"
}
type PaginationPageItem = {
    id: string | number;
    label: string | number;
};
type PaginationPage = number | PaginationPageItem;
type PaginationCallback = (page: PaginationPageItem) => void;
type PaginationProps = BoxProps & {
    itemCount: number;
    itemsPerPage: number;
    startPage?: number | string;
    pageRange?: number;
    paginationStyle?: PaginationStyle;
    hash?: number | null;
    seperator?: string;
    loading?: boolean;
    breakLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    renderOnZeroPageCount?: boolean;
    onPageChange?: PaginationCallback;
};

declare const Pagination: react.ForwardRefExoticComponent<Omit<PaginationProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type PasswordProps = Omit<InputProps, `type` | `numeric`> & {
    strenthMeter?: boolean;
};
declare const Password: react.ForwardRefExoticComponent<Omit<PasswordProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type PinInputProps = InputProps & {
    mask?: boolean;
    size?: number;
    length?: number;
};
declare const PinInput: react.ForwardRefExoticComponent<Omit<PinInputProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type ProgressBarProps = BoxProps & {
    progress?: number;
    type?: ValueOf<typeof PROGRESS>;
    animated?: boolean;
};
interface ProgressHandler {
    setProgress?: (p: number) => void;
}

declare const ProgressBar: react.ForwardRefExoticComponent<Omit<ProgressBarProps, "ref"> & react.RefAttributes<ProgressHandler>>;

type RadioProps = Props<"input"> & {
    type?: ValueOf<typeof RADIO>;
    variant?: ValueOf<typeof Variant>;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
};
interface RadioHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void;
    toggle: (triggerChange?: boolean) => void;
}

declare const Radio: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof RADIO>;
    variant?: ValueOf<typeof Variant>;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & react.RefAttributes<RadioHandler>>;

type ScrollViewProps = BoxProps & {
    style?: CSSProperties;
    speed?: number;
};

declare const ScrollView: react.ForwardRefExoticComponent<Omit<ScrollViewProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type SearchProps = InputProps & {
    onSubmit?: (value: string) => void;
    onChange?: (value: string) => void;
    onClear?: () => void;
    withStyle?: string;
    shortcut?: KeyCombination;
    reverse?: boolean;
    searchIcon?: string | ReactNode;
    hideSearchIcon?: boolean;
    clearIcon?: string | ReactNode;
    hideClearIcon?: boolean;
};
interface SearchHandler {
    focus: () => void;
}

declare const Search: react.ForwardRefExoticComponent<Omit<SearchProps, "ref"> & react.RefAttributes<SearchHandler>>;

/**
 * `SelectTabs` component is a segmented control that allows switching between segments.
 *
 * @component
 * @param {SegmentProps} props - Props for the segmented control component.
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the root div element.
 * @returns {JSX.Element} The rendered segmented control.
 *
 * @example
 * // Usage example
 * const segments = [
 *   { index: 0, label: "Home", icon: "home_icon" },
 *   { index: 1, label: "Profile", icon: "profile_icon" },
 *   { index: 2, label: "Settings", icon: "settings_icon" }
 * ];
 *
 * <SelectTabs selected={1} items={segments} />
 */
declare const Segmented: react.ForwardRefExoticComponent<Omit<SegmentProps, "ref"> & react.RefAttributes<SegmentController>>;

/**
 * Interface for the Select component handle, accessible via React ref.
 *
 * @example
 * ```tsx
 * const selectRef = useRef<SelectHandler>(null);
 * // ...
 * selectRef.current?.setSelected("option-value");
 * ```
 */
interface SelectHandler {
    /**
     * Programmatically sets the selected option.
     * @param option - The option object or value string to select.
     */
    setSelected: (option: Option | string) => void;
    /**
     * Retrieves the currently selected option object.
     * @returns The selected Option or null if nothing is selected.
     */
    getValue: () => Option | null;
}
/**
 * Represents an individual option within the Select component.
 */
type Option = {
    /** Optional icon to display next to the label. Can be a string (URL/Path) or a ReactNode. */
    icon?: string | ReactNode;
    /** Optional color for the icon. */
    iconColor?: string;
    /** The display text for the option. */
    label: string;
    /** The underlying value for the option. */
    value: string;
};
/**
 * Represents an option object with a label and value.
 */
type Value = FormEventHandler<HTMLDivElement> & Option;
interface OptionItemProps {
    updateValue: (o: Option) => void;
    o: Option;
    value: Option;
}
/**
 * Props for the Select component.
 */
type SelectProps = Omit<BoxProps, "onChange"> & {
    ref?: Ref<SelectHandler>;
    /**
     * Size of the select field.
     * @default "sm"
     */
    variant?: ValueOf<typeof Variant>;
    /**
     * Indicates if the select field is required and its validation type.
     */
    required?: ValueOf<typeof FORMVALIDATION>;
    /**
     * Array of options to be displayed in the select dropdown.
     * * @example
     * ```tsx
     * [
     *  {
     *      icon:  "apple",
     *      iconColor: "#ff0000",
     *      label: "Apple",
     *      value: "apple",
     *  }
     * ]
     * ```
     */
    options: Option[];
    /**
     * Label for the select field.
     */
    label?: string;
    /**
     * The currently selected option.
     */
    selected?: string | Option;
    /**
     * Enables the search functionality within the select dropdown.
     */
    search?: boolean;
    /**
     * Callback function triggered when the selected option changes.
     * @param v - The newly selected option.
     */
    onChange?: (v: Option) => void;
    /**
     * Placeholder text for the search input field.
     */
    searchPlaceholder?: string;
    /**
     * Max Height
     */
    maxHeight?: number;
    arrowDownIcon?: string | ReactNode;
    arrowUpIcon?: string | ReactNode;
};

declare const Select: react.ForwardRefExoticComponent<Omit<SelectProps, "ref"> & react.RefAttributes<SelectHandler>>;

type SliderProps = BoxProps & {
    type?: ValueOf<typeof SLIDER>;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    roundValue?: boolean;
    onChange?: (value: number) => void;
};
declare const Slider: react.ForwardRefExoticComponent<Omit<SliderProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type SpanProps = Props<`span`> & {
    ref?: Ref<HTMLSpanElement>;
};

declare const Span: {
    ({ ref, ...props }: SpanProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Spinner: {
    (props: SpinnerProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Switch: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof CHECKBOX>;
    variant?: ValueOf<typeof Variant>;
    checked?: boolean;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & react.RefAttributes<CheckboxHandler>>;

interface TableController {
    setLoading: (mod: boolean) => void;
}
/**
 * Callback function for row selection.
 *
 * @template T - The type of data for each row.
 * @param {T} row - The row data.
 * @param {boolean} selected - Whether the row is selected.
 */
type RowSelectCallback<T> = (row: T, selected: boolean) => void;
/**
 * Callback function for table sorting.
 *
 * @param {string} col - The column key to sort by.
 * @param {number} dir - The direction of sorting (1 for ascending, -1 for descending).
 */
type TableSortCallback = (col: string, dir: number) => void;
/**
 * Represents a row in the table.
 *
 * @template T - The type of data for each row.
 *
 * @property {number} index - The index of the row.
 * @property {Column<T>[]} schema - The schema defining the columns of the row.
 * @property {dynamicObject} styles - The styles to apply to the row.
 * @property {string[]} [ids] - The IDs associated with the row.
 * @property {boolean} [animate] - Whether to animate the row.
 * @property {T} [data] - The data for the row.
 * @property {string} [rowClassName] - The CSS class name to apply to the row.
 * @property {boolean} [selectable] - Whether the row is selectable.
 * @property {string | null} [sortBy] - The column key to sort by.
 * @property {RowSelectCallback<T>} [onSelect] - Callback when the row's selection state changes.
 * @property {TableSortCallback} [onSort] - Callback when the row is sorted.
 * @property {PubSub} pubsub - The PubSub instance for event handling.
 * @property {RefObject<HTMLDivElement | null>} [tableRef] - The reference to the table element.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void} [onContextMenu] - Callback for row context menu event.
 */
type Row<T> = {
    index: number;
    schema: Column<T>[];
    styles: dynamic;
    ids?: string[];
    animate?: boolean;
    data?: T;
    rowClassName?: string;
    selectable?: boolean;
    sortBy?: string | null;
    onSelect?: RowSelectCallback<T>;
    onSort?: TableSortCallback;
    onRowClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
    pubsub: PubSub;
    loading: boolean;
    tableRef?: RefObject<HTMLDivElement | null>;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
};
/**
 * Represents a column in the table.
 *
 * @template T - The type of data for each row.
 *
 * @property {string | number} id - The unique identifier for the column.
 * @property {string | ReactNode | dynamicObject} [value] - The value to display in the column.
 * @property {number} [weight] - The weight of the column for layout purposes.
 * @property {number | string} [w] - The width of the column.
 * @property {number | string} [maxW] - The maximum width of the column.
 * @property {number | string} [minW] - The minimum width of the column.
 * @property {number | string} [h] - The height of the column.
 * @property {number | string} [maxH] - The maximum height of the column.
 * @property {number | string} [minH] - The minimum height of the column.
 * @property {boolean} [resize] - Whether the column is resizable.
 * @property {boolean} [sortable] - Whether the column is sortable.
 * @property {TableSortCallback} [onSort] - Callback when the column is sorted.
 * @property {string} [as] - The HTML tag to render the column as.
 * @property {boolean} [renderWhenHeader] - Whether to render the column when it is a header.
 * @property {(row: T, index: number) => ReactNode} [render] - Function to render the column content.
 */
type Column<T> = {
    id: string | number;
    value?: string | ReactNode | dynamic;
    weight?: number;
    w?: number | string;
    maxW?: number | string;
    minW?: number | string;
    h?: number | string;
    maxH?: number | string;
    minH?: number | string;
    resize?: boolean;
    sortable?: boolean;
    onSort?: TableSortCallback;
    as?: string;
    renderWhenHeader?: boolean;
    render?: (row: T, index: number) => ReactNode;
};
/**
 * Props for the Table component.
 *
 * @template T - The type of data for each row.
 *
 * @extends BoxProps
 *
 * @property {Column<T>[]} schema - The schema defining the columns of the table.
 * @property {T[]} rows - The data rows to be displayed in the table.
 * @property {number} [rowCount] - The total number of rows.
 * @property {number} [rowsPerPage] - The number of rows to display per page.
 * @property {string} [rowClassName] - The CSS class name to apply to each row.
 * @property {number} [currentPage] - The current page number.
 * @property {boolean} [pagination] - Whether to enable pagination.
 * @property {number | null} [paginationHash] - A hash to force pagination update.
 * @property {boolean} [showPaginationOnZeroPageCount] - Whether to show pagination controls when there are zero pages.
 * @property {boolean} [animateRows] - Whether to animate rows on change.
 * @property {boolean} [header] - Whether to show the table header.
 * @property {string} [sortBy] - The column key to sort by.
 * @property {boolean} [selectableRows] - Whether rows are selectable.
 * @property {boolean} [hoverable] - Whether rows should have a hover effect.
 * @property {boolean} [loading] - Renders placeholder rows when true
 * @property {number} [loadingRowCount] - If greater than 0, shows loading number of empty rows with spinner.
 * @property {RowSelectCallback<T>} [onRowSelectToggle] - Callback when a row's selection state changes.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void} [onRowContextMenu] - Callback for row context menu event.
 * @property {PaginationCallback} [onPageChange] - Callback when the page changes.
 * @property {TableSortCallback} [onSort] - Callback when the table is sorted.
 */
type TableProps<T> = BoxProps & {
    schema: Column<T>[];
    rows: T[];
    rowCount?: number;
    rowsPerPage?: number;
    rowClassName?: string;
    currentPage?: number;
    pagination?: boolean;
    paginationHash?: number | null;
    showPaginationOnZeroPageCount?: boolean;
    animateRows?: boolean;
    header?: boolean;
    sortBy?: string;
    selectableRows?: boolean;
    hoverable?: boolean;
    loading?: boolean;
    loadingRowCount?: number;
    loadingMessage?: string;
    spinner?: ValueOf<typeof SPINNER>;
    emptyMessage?: ReactNode | FC;
    onRowSelectToggle?: RowSelectCallback<T>;
    onRowClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
    onPageChange?: PaginationCallback;
    onSort?: TableSortCallback;
};

declare const ForwardedTable: <T>(props: TableProps<T> & {
    ref?: Ref<TableController>;
}) => JSX.Element;

type TableOfContentItem = {
    tag: string;
    label: string;
};
type TableOfContentsProps = BoxProps & {
    ref?: Ref<HTMLDivElement>;
    title?: ReactNode;
    items: TableOfContentItem[];
};

declare const TableOfContents: ({ ref, ...props }: TableOfContentsProps) => react_jsx_runtime.JSX.Element;

interface TabBodyProps {
    isActive: boolean;
    transitionType?: "slide" | "fade" | "scale";
    speed: number;
    width: number;
    render: boolean;
    content: string | ReactNode | ReactNode[];
    onHeightChange: (h: string | number) => void;
}
/**
 * Represents an individual tab configuration within a TabView.
 */
interface Tab {
    /**
     * Callback fired when this specific tab is selected.
     * @example onSelect: (tab) => console.log('Selected', tab.label)
     */
    onSelect?: (tab: Tab, index: number) => void;
    /**
     * Optional tag for identification.
     * @example tag: "settings-tab"
     */
    tag?: string;
    /**
     * Unique key for the tab.
     * @example key: "home"
     */
    key?: string;
    /**
     * Icon to display next to the label.
     * @example icon: <HomeIcon />
     */
    icon?: ReactNode | ReactNode[];
    /**
     * The clickable label of the tab.
     * @example label: "Profile"
     */
    label: string | ReactNode | ReactNode[];
    /**
     * The content to display when the tab is active.
     * @example body: <div>Welcome to your profile</div>
     */
    body: string | ReactNode | ReactNode[];
    /**
     * If true, the tab content will be rendered even when not active.
     * Useful for maintaining state in complex forms or maps.
     * @example render: true
     */
    render?: boolean;
}
/**
 * Internal props for the individual Tab trigger component.
 */
type TabProps = {
    /** The tab configuration object. */
    tab: Tab;
    /** The index of this tab. */
    index: number;
    /** The currently active tab index. */
    activeTab: number;
    /** Click handler to change the active tab. */
    onClick: (index: number) => void;
};
/**
 * Props for the TabView component.
 */
type TabViewProps = Omit<BoxProps, "onChange"> & {
    /** Callback fired when the active tab changes. */
    onChange?: (tab: Tab, index: number) => void;
    /**
     * Animation speed in milliseconds for tab transitions.
     * @default 300
     * @example speed: 500
     */
    speed?: number;
    /**
     * The tabs layout style.
     * `fixed` distributes tab width equally.
     * `default` sizes tabs based on content.
     * @example tabStyle: "fixed"
     */
    tabStyle?: "fixed" | "default";
    variant?: ValueOf<typeof Variant>;
    transitionType?: "slide" | "fade" | "scale";
    /**
     * Array of tab objects to render.
     * @example tabs={[{ label: 'Tab 1', body: 'Content 1' }]}
     */
    tabs: Tab[];
    /**
     * If true, all tab bodies are rendered to the DOM immediately.
     * Useful for SEO or performance on small tab sets.
     * @example prerender: true
     */
    prerender?: boolean;
};
/**
 * Ref handle for controlling the TabView imperatively.
 */
interface TabViewHandler {
    /**
     * Programmatically set the active tab by index.
     * @param index The index of the tab to activate.
     * @example ref.current?.setTab(1)
     */
    setTab: (index: number) => void;
}

declare const TabView: {
    ({ ref, ...props }: TabViewProps & {
        ref?: Ref<TabViewHandler>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};

interface TerminalHandler {
    push: (line: TerminalLine | string) => void;
    clear: () => void;
}
type TerminalLine = {
    type: 'command' | 'output' | 'error' | 'success';
    content: string;
};
interface TerminalProps {
    commands?: TerminalCommands;
    onCommand?: (cmd: string) => string | Promise<string>;
    welcomeMessage?: string;
    prompt?: string;
    className?: string;
    variant?: ValueOf<typeof Variant>;
}
type TerminalCommandFn = (args: string[]) => string | Promise<string>;
type TerminalCommands = Record<string, TerminalCommandFn>;

declare const Terminal: ({ ref, commands, onCommand, welcomeMessage, prompt, variant, ...props }: TerminalProps & {
    ref?: Ref<TerminalHandler>;
}) => react_jsx_runtime.JSX.Element;

declare const Text: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref">, keyof ZuzProps> & {
    h?: number;
    html?: ReactNode | string;
    lines?: number;
} & react.RefAttributes<HTMLHeadingElement>>;

declare const TextArea: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">, keyof ZuzProps> & {
    autoResize?: boolean;
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`;
    maxHeight?: number | string;
    variant?: ValueOf<typeof Variant>;
    command?: string;
    commands?: _zuzjs_hooks.Command[];
    cmd?: (value: string, textarea: HTMLTextAreaElement | HTMLInputElement) => void;
    renderDropdown?: (props: {
        show: boolean;
        position: {
            top: number;
            left: number;
        };
        commands: _zuzjs_hooks.Command[];
        onSelect: (value: string) => void;
    }) => React.ReactNode;
} & react.RefAttributes<HTMLTextAreaElement>>;

type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean;
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`;
    maxHeight?: number | string;
    variant?: ValueOf<typeof Variant>;
    command?: string;
    commands?: Command[];
    cmd?: (value: string, textarea: HTMLTextAreaElement | HTMLInputElement) => void;
    renderDropdown?: (props: {
        show: boolean;
        position: {
            top: number;
            left: number;
        };
        commands: Command[];
        onSelect: (value: string) => void;
    }) => React.ReactNode;
};

type TextWheelProps = Omit<BoxProps, "name"> & {
    value?: number | string;
    color?: string;
    direction?: `up` | `down`;
    charDelay?: number | ((index: number) => number);
    charDuration?: number | ((index: number) => number);
};
interface TextWheelHandler {
    setValue: (v: number | string) => void;
    updateValue: (v: number | string) => void;
}

declare const TextWheel: react__default.ForwardRefExoticComponent<Omit<TextWheelProps, "ref"> & react__default.RefAttributes<TextWheelHandler>>;

declare enum ToastType {
    Default = "default",
    Success = "success",
    Error = "error",
    Warn = "warn",
    Promise = "promise"
}
declare const ToastDefaultTitle: dynamic;
interface ToastProps {
    id?: number;
    type: ToastType;
    icon?: string;
    title?: string | ReactNode;
    message?: string | ReactNode;
    duration?: number;
    onClose?: (id: number) => void;
    onClick?: () => void;
}

declare const Toast: FC<ToastProps & {
    index: number;
}>;

type ToolTipProps = BoxProps & {
    position?: ValueOf<typeof POSITION>;
    margin?: number;
};

declare const ToolTip: react.ForwardRefExoticComponent<Omit<ToolTipProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

interface TreeNodeIcons {
    rootOpen?: ReactNode;
    rootClose?: ReactNode;
    nodeOpen?: ReactNode;
    nodeClose?: ReactNode;
    arrowOpen?: ReactNode;
    arrowClose?: ReactNode;
    arrowDisabled?: ReactNode;
}
type TreeViewProps = Omit<BoxProps, `tag`> & {
    tag?: string;
    roots: string[];
    nodes: TreeNode[];
    onNodeSelect: (tag: string) => void;
    icons?: TreeNodeIcons;
    selected?: string;
};
interface TreeViewHandler {
    getSelected?: () => String;
}
interface TreeNode {
    tag: string;
    label: string;
    icon?: ReactNode;
    under?: string;
    selected?: string;
    expanded?: boolean;
    isHead?: boolean;
}
type TreeItemProps = BoxProps & {
    treeTag: string;
    meta: TreeNode;
    nodes: TreeNode[];
    expanded: boolean;
    roots: string[];
    onSelect: (tag: string) => void;
    selected?: String;
    icons?: TreeNodeIcons;
};
interface TreeItemHandler {
    onSelect?: (v: TreeNode) => void;
}

declare const TreeView: react.ForwardRefExoticComponent<Omit<TreeViewProps, "ref"> & react.RefAttributes<TreeViewHandler>>;

type ColorScheme = ValueOf<typeof COLORTHEME>;
interface ThemeConfig {
    /**
     * Auto generated zuzMap.ts
     */
    zuzMap?: Record<string, string>;
    variant?: ValueOf<typeof Variant>;
    group?: GroupProps & {
        fx?: animationProps;
    };
    /**
     * Dialog Default Settings
     */
    dialog?: Omit<DialogProps, `id` | `title` | `message` | `action` | `onShow` | `onHide`>;
    /**
     * Dialog Default Settings
     */
    drawer?: Omit<DrawerProps, `as` | `children` | `onClose`>;
    /**
     * App Level Spinner Conf
     */
    spinner?: {
        type?: ValueOf<typeof SPINNER>;
    };
    toast?: {
        curve?: ValueOf<typeof TRANSITION_CURVES>;
        duration?: number;
    };
}
type ThemeProviderProps = {
    children: ReactNode;
    forceTheme?: ColorScheme;
    storageKey?: string;
} & ThemeConfig;
declare const ThemeProvider: ({ children, storageKey, forceTheme, zuzMap, ...conf }: ThemeProviderProps) => react_jsx_runtime.JSX.Element;

declare const useBase: <T extends keyof JSX.IntrinsicElements>(props: Props<T>, ref?: RefObject<HTMLElement>) => {
    style: CSSProperties;
    className: string;
    rest: ComponentPropsWithRef<T>;
};

interface PositionOptions {
    offset?: number;
    direction?: ValueOf<typeof POSITION>;
    container?: HTMLElement | null;
    triggerRef?: React.RefObject<HTMLElement>;
}
declare const usePosition: (ref: React.RefObject<HTMLElement>, // The element to be positioned
options?: PositionOptions) => {
    postion: "fixed" | "absolute" | null;
    reposition: () => void;
};

declare const useDialog: () => {
    clearAll: () => void;
    show: (pops: Omit<DialogProps, `id` | `onShow` | `onHide`>) => number;
    hide: (id: number) => void;
};

declare const useToast: () => {
    show: (title: string, message?: string, icon?: string, duration?: number) => number;
    hide: (id: number) => void;
    success: (title: string, message?: string, icon?: string, duration?: number) => number;
    error: (title: string, message?: string, icon?: string, duration?: number) => number;
    warn: (title: string, message?: string, icon?: string, duration?: number) => number;
    promise: (title: string, message?: string, icon?: string, duration?: number) => number;
    clearAll: () => void;
};

declare const useDrawer: () => {
    clearAll: () => void;
    open: (child?: string | ReactNode | ReactNode[]) => number;
    right: (child?: string | ReactNode | ReactNode[]) => number;
    left: (child?: string | ReactNode | ReactNode[]) => number;
    top: (child?: string | ReactNode | ReactNode[]) => number;
    bottom: (child?: string | ReactNode | ReactNode[]) => number;
    close: (id: number) => void;
};

declare const useFx: (fx?: animationProps, ref?: RefObject<HTMLElement>) => {
    style: any;
};

type MorphOptions = {
    duration?: number;
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    borderRadius?: {
        from: number;
        to: number;
    };
    targetWidth?: number;
};
declare const useMorph: (sourceRef: RefObject<HTMLElement | null>, active: boolean, options?: MorphOptions) => {
    style: any;
    isMeasured: boolean;
    sourceRect: DOMRect | null;
};

declare const useContextMenu: () => {
    showContextMenu: (e: MouseEvent$1<Element, MouseEvent> | TouchEvent, items: ContextItem[], origin?: ValueOf<typeof ORIGIN>) => void;
    showMenu: (ref: RefObject<HTMLElement | null>, items: ContextItem[], origin?: ValueOf<typeof ORIGIN>) => void;
    hide: () => void;
};

declare const PACKAGE_NAME: string;
declare const cleanProps: <T extends dynamic>(props: T, withProps?: string[]) => T;
declare const splitAtoms: (input: string) => string[];

declare const setZuzMap: (map: Record<string, string>) => void;
declare const getZuzMap: () => Record<string, string>;
/**
 * Converts Zuz utility strings or arrays into hashed class names.
 */
declare const buildClassString: (input: ZuzStyleString | ZuzStyleString[]) => string;
/**
 * Standalone CSS utility for non-zuzjs components.
 */
declare const css: (input: ZuzStyleString | ZuzStyleString[]) => string;
declare const buildWithStyles: (source: dynamic) => dynamic;
declare const getAnimationCurve: (curve?: string | ValueOf<typeof TRANSITION_CURVES>) => string;
declare const animationTransition: (transition: ValueOf<typeof TRANSITIONS>, offset?: number) => {
    from: {};
    to: {};
};
declare const getAnimationTransition: (transition: ValueOf<typeof TRANSITIONS>, to?: boolean, from?: boolean) => dynamic;

export { ALERT, AVATAR, Accordion, type AccordionHandler, type AccordionProps, ActionBar, type ActionBarHandler, type ActionBarItem, type ActionBarProps, Alert, type AlertHandler, type AlertProps, AutoComplete, type AutoCompleteProps, Avatar, type AvatarHandler, type AvatarProps, Badge, type BadgeProps, Box, type BoxProps, Bubble, BubbleMediaType, type BubbleProps, BubbleStatus, Button, type ButtonHandler, type ButtonProps, ButtonState, CHART, CHECKBOX, COLORTHEME, Calendar, type CalendarProps, Chart, type ChartProps, CheckBox, type CheckBoxProps, type CheckboxHandler, CodeBlock, type CodeBlockProps, ColorScheme$1 as ColorScheme, type Column, type ContextItem, ContextMenu, type ContextMenuHandler, type ContextMenuProps, type CookieConsentProps, CookiesConsent, Cover, type CoverProps, type CropHandler, CropShape, Cropper, type CropperProps, Crumb, type CrumbItem, type CrumbProps, DATATYPE, DIALOG, DIALOG_ACTION_POSITION, DRAWER_SIDE, DatePicker, Dialog, type DialogActionHandler, type DialogHandler, type DialogProps, Drawer, type DrawerHandler, type DrawerProps, FILTER, FORMVALIDATION, FORMVALIDATION_STYLE, Fab, type FabProps, type FilterProps, Filters, Form, type FormHandler, type FormInputs, type FormProps, Group, type GroupProps, Icon, type IconProps, Image, type ImageProps, Input, type InputProps, type KeyCombination, type KeyboardKey, type KeyboardKeyProps, KeyBoardKeys as KeyboardKeys, KeysLabelMap, KeysMap, Label, type LabelProps, List, type ListItem, type ListItemObject, type ListProps, type MenuItemProps, type MorphOptions, type NetworkManagerprops, NetworkManager as NetworkStatus, ORIGIN, type Option, type OptionItemProps, OriginType, Overlay, type OverlayProps, PACKAGE_NAME, POSITION, PROGRESS, Pagination, type PaginationCallback, type PaginationPage, type PaginationPageItem, type PaginationProps, PaginationStyle, Password, type PasswordProps, PinInput, type PinInputProps, Position, ProgressBar, type ProgressBarProps, type ProgressHandler, type Props, RADIO, Radio, type RadioHandler, type RadioProps, type Row, type RowSelectCallback, SHEET, SHEET_ACTION_POSITION, SKELETON, SLIDER, SORT, SPINNER, ScrollView, type ScrollViewProps, Search, type SearchHandler, type SearchProps, type Segment, type SegmentController, type SegmentItemProps, type SegmentProps, Select, type SelectHandler, type SelectProps, Segmented as SelectTabs, Sheet, type SheetHandler, type SheetProps, type Skeleton, Slider, type SliderProps, Span, type SpanProps, Spinner, type SpinnerProps, Status, Switch, TRANSITIONS, TRANSITION_CURVES, type Tab, type TabBodyProps, type TabProps, TabView, type TabViewHandler, type TabViewProps, ForwardedTable as Table, type TableController, type TableOfContentItem, TableOfContents, type TableOfContentsProps, type TableProps, type TableSortCallback, Terminal, type TerminalCommandFn, type TerminalCommands, type TerminalHandler, type TerminalLine, type TerminalProps, Text, type TextAreaProps, TextWheel, type TextWheelHandler, type TextWheelProps, TextArea as Textarea, ThemeProvider, ToastDefaultTitle, type ToastProps, Toast as ToastProvider, ToastType, ToolTip, type ToolTipProps, type TreeItemHandler, type TreeItemProps, type TreeNode, type TreeNodeIcons, TreeView, type TreeViewHandler, type TreeViewProps, type Value, type ValueOf, Variant, type ZuzCommonValues, type ZuzProps, type ZuzStyleString, type animationProps, animationTransition, buildClassString, buildWithStyles, cleanProps, css, type cssShortKey, type cssShortKeys, type dynamic, getAnimationCurve, getAnimationTransition, getZuzMap, isKeyCombination, type parallaxEffectProps, setZuzMap, splitAtoms, useBase, useContextMenu, useDialog, useDrawer, useFx, useMorph, usePosition, useToast };
