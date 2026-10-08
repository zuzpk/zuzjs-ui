import * as react from 'react';
import react__default, { Ref, ElementType, ComponentPropsWithoutRef, ReactNode, FC, MouseEvent as MouseEvent$1, RefObject, CSSProperties, UIEvent, FormEventHandler, ReactElement, JSX, ComponentPropsWithRef } from 'react';
import * as _zuzjs_hooks from '@zuzjs/hooks';
import { UseDragSpecFactory, UseDropSpecFactory, TimelineLayer, ScrollPhysicsOptions, AgentActivity, AgentPermissionRequest, AgentController, AgentCapabilities, AgentThinkingLevel, AgentMessage, AgentConnectionState, LineChartProps, ScrollBreakpoint, DragType, MediaItem, useMediaPlayer, Command, TimelineOptions, UseTimelineReturn, TimelineEntry } from '@zuzjs/hooks';
import { dynamic as dynamic$1, PubSub } from '@zuzjs/core';
import { BundledLanguage, BundledTheme } from 'shiki';
import { CountryCode } from 'libphonenumber-js';

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
declare const PLACEMENTS: {
    readonly Top: "top";
    readonly TopStart: "top-start";
    readonly TopCenter: "top-center";
    readonly TopEnd: "top-end";
    readonly Bottom: "bottom";
    readonly BottomStart: "bottom-start";
    readonly BottomCenter: "bottom-center";
    readonly BottomEnd: "bottom-end";
    readonly Left: "left";
    readonly LeftStart: "left-start";
    readonly LeftCenter: "left-center";
    readonly LeftEnd: "left-end";
    readonly Right: "right";
    readonly RightStart: "right-start";
    readonly RightCenter: "right-center";
    readonly RightEnd: "right-end";
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
    readonly NotEmpty: "NOT_EMPTY";
    readonly NotMinusOne: "NOT_MINUS_ONE";
    /** Ensures date is not in the past (includes today) */
    readonly MinDateToday: "MIN_DATE_TODAY";
    /** Ensures date is after a specific threshold */
    readonly MinDate: "MIN_DATE";
    /** Ensures date does not exceed today or a specific threshold */
    readonly MaxDate: "MAX_DATE";
};
declare const ALERT: {
    readonly Default: "default";
    readonly Success: "success";
    readonly Error: "error";
    readonly Warning: "warning";
    readonly Info: "info";
    readonly Primary: "primary";
    readonly Secondary: "secondary";
    readonly Neutral: "neutral";
    readonly Critical: "critical";
    readonly CriticalOutline: "critical-outline";
    readonly Tip: "tip";
    readonly Draft: "draft";
};
declare const TRANSITION_CURVES: {
    readonly Spring: "SPRING";
    readonly Ease: "EASE";
    readonly EaseIn: "EASEIN";
    readonly EaseOut: "EASEOUT";
    readonly Liquid: "LIQUID";
    readonly EaseInOut: "EASEINOUT";
    readonly EaseOutBack: "EASEOUTBACK";
    readonly Bounce: "BOUNCE";
    readonly Linear: "LINEAR";
};
declare const TRANSITIONS: {
    readonly FadeIn: "FADE_IN";
    readonly ScaleIn: "SCALE_IN";
    readonly SlideInTop: "SLIDE_FROM_TOP";
    readonly SlideInRight: "SLIDE_FROM_RIGHT";
    readonly SlideInBottom: "SLIDE_FROM_BOTTOM";
    readonly SlideInTopScale: "SLIDE_FROM_TOP_SCALE";
    readonly SlideInBottomScale: "SLIDE_FROM_BOTTOM_SCALE";
    readonly SlideInLeft: "SLIDE_FROM_LEFT";
    readonly Zoom: "ZOOM";
    readonly Bounce: "BOUNCE";
    readonly Flip: "FLIP";
    readonly Rotate: "ROTATE";
    readonly Pulse: "PULSE";
    readonly Shake: "SHAKE";
};
declare const Status: {
    readonly None: "none";
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
    readonly Confirm: "CONFIRM";
};
declare const DIALOG: {
    readonly Dialog: "DIALOG";
    readonly Default: "DEFAULT";
    readonly Error: "ERROR";
    readonly Success: "SUCCESS";
    readonly Warn: "WARN";
    readonly Promise: "PROMISE";
    readonly Confirm: "CONFIRM";
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

type ZuzTimelineProp = TimelineLayer | string;
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
    /** Makes Component Draggable */
    draggable?: boolean;
    dragOptions?: UseDragSpecFactory<any, Record<string, unknown>>;
    /** Makes Component Droppable */
    droppable?: boolean;
    dropOptions?: UseDropSpecFactory<any, Record<string, unknown>>;
    busy?: boolean;
    stripes?: `background` | `overlay`;
    /**
     * Timeline binding for this element.
     *
     * Pass a full layer object to register a new layer:
     * ```tsx
     * <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>…</Box>
     * ```
     *
     * Pass a string id to reuse effects from an already-registered layer:
     * ```tsx
     * <Text timeline="hero">Repeated animated text</Text>
     * ```
     */
    timeline?: ZuzTimelineProp;
    /**
     * Marks this element as the timeline measurement root for the nearest `TimelineProvider`.
     * Use this when your app scrolls inside an inner container (e.g. custom `ScrollView`).
     */
    timelineRoot?: boolean;
    textSize?: string | number;
    square?: boolean;
    /**
     * Scroll physics configuration for applying transform effects based on scroll position.
     * Enables smooth animations like parallax, scaling, and rotation effects.
     */
    scrollPhysics?: ScrollPhysicsOptions;
    /**
     * Reference to a custom scroll container (e.g., ScrollView).
     * If not provided, uses window scroll events.
     */
    scrollContainer?: Ref<HTMLElement>;
}
interface BoxProps extends Partial<Props<`div`>> {
    name?: string;
    ref?: Ref<HTMLDivElement>;
    cols?: boolean;
    with?: WithFormValidation;
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
interface LayerHandler {
    inBackground?: boolean;
    forceClose?: boolean;
    forceLoading?: boolean;
    /** Soft-close request token: routes through the component's tryClose (respects dirty guard). */
    requestClose?: number;
}
interface DialogController {
    id: number;
    setLoading: (mod: boolean) => void;
    setDirty: (dirty: boolean) => void;
    hide: () => void;
}
interface DrawerController {
    id: number;
    setLoading: (mod: boolean) => void;
    setDirty: (dirty: boolean) => void;
    close: () => void;
}

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
type FormValidation = ValueOf<typeof FORMVALIDATION>;
type WithFormValidation = FormValidation | `${FormValidation}${string}`;
type AnimationTransition = `back` | `expo` | `sine` | `power` | `circ` | `bounce` | `elastic` | `ease` | `spring` | `liquid`;
type Placement = ValueOf<typeof PLACEMENTS>;
type Appearance = `solid` | `subtle` | `surface` | `outline` | `ghost` | `plain` | `link`;
type Country = {
    name: string;
    code: string;
    dialCode: string;
};

declare const Countries: Country[];

declare const VERSION = "1.1.43";

type AccordionProps = BoxProps & {
    message?: string | ReactNode;
    title: string | ReactNode | ReactNode[];
};
interface AccordionHandler {
    open: () => void;
    close: () => void;
}

/**
 * Accordion component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Accordion title="Account" message="Manage your profile and security" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Accordion title="Settings" message="Configure preferences" variant="sm" disabled={false} />
 * ```
 * @param title - Title text or element
 * @param message - Message text or element
 * @param variant - Visual variant or style
 * @param disabled - Whether component is disabled
 */
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
 * Actionbar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Actionbar />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Actionbar sticky={true} />
 * ```
 * @param sticky - sticky prop
 */
declare const ActionBar: react.ForwardRefExoticComponent<Omit<ActionBarProps, "ref"> & react.RefAttributes<ActionBarHandler>>;

type AgentChatBrand = {
    name: string;
};
type AgentConnectionOptions = {
    state: AgentConnectionState;
    /** A callback used to obtain an authoritative snapshot after reconnection. */
    onReconnect?: () => void | Promise<void>;
};
/** Presentation options for a live thinking/tool timeline. */
type AgentActivityOptions = {
    /** Render one compact current-status row while a turn is running. */
    compactLive?: boolean;
};
type AgentApprovalOptions = {
    request: AgentPermissionRequest;
    onRespond: (input: {
        request: AgentPermissionRequest;
        approved: boolean;
        response?: string;
    }) => void | Promise<void>;
};
/** A generic tool invocation with optional structured input and output. */
type AgentToolInvocation = {
    id: string;
    tool: string;
    input?: unknown;
    output?: unknown;
    state: 'pending' | 'running' | 'completed' | 'failed';
    error?: string;
};
type AgentComposerModel = {
    value: string;
    label: string;
};
type AgentComposerControls = {
    models?: AgentComposerModel[];
    defaultModel?: string;
    thinkingLevels?: AgentThinkingLevel[];
    defaultThinkingLevel?: AgentThinkingLevel;
};
/** A chronological execution block positioned around an agent message. */
type AgentActivityBlock = {
    id: string;
    activity: AgentActivity[];
    placement: 'before' | 'after';
    /** Omit to render before the first message (or after the last for `after`). */
    messageId?: string;
    /** Explicitly seals a live block, even if its last activity has not updated yet. */
    done?: boolean;
};
type AgentIcons = {
    send?: string;
    stop?: string;
    model?: string;
    thinking?: string;
    add?: string;
    list?: string;
    todo?: string;
    document?: string;
    search?: string;
    terminal?: string;
    write?: string;
    read?: string;
    magic?: string;
    copy?: string;
    branch?: string;
    done?: string;
};
type AgentChatProps = {
    /** Controls the component density and maps to Zuz's standard size tokens. */
    variant?: ValueOf<typeof Variant>;
    agent: AgentController;
    capabilities: AgentCapabilities;
    /** Optional model and thinking controls displayed in the SendBox toolbar. */
    composerControls?: AgentComposerControls;
    /** Replaces the standard composer with a response form for a pending tool approval. */
    approval?: AgentApprovalOptions;
    brand?: AgentChatBrand;
    /** Render the built-in sessions sidebar. Disable it to render a host-owned sidebar with useAgentChat(). */
    renderSidebar?: boolean;
    /** Override the built-in AgentMarkdown renderer for host-specific needs. */
    renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
    /** Chronological thinking/tool blocks. Legacy `message.activity` remains supported as a block before that message. */
    activityBlocks?: AgentActivityBlock[];
    /** Presentation options for thinking and tool activity. */
    activity?: AgentActivityOptions;
    /** Generic tool calls rendered below assistant messages. */
    tools?: AgentToolInvocation[];
    /** Coarse transport state; reconnecting is shown without discarding local drafts. */
    connection?: AgentConnectionOptions;
    /** Host content rendered before the durable message/timeline list, e.g. file markers. */
    renderAboveMessages?: ReactNode;
    /** Native SendBox + action. Omit it to hide the action. */
    onAdd?: () => void | Promise<void>;
    addButtonTitle?: string;
    /** Host content rendered above the standard SendBox, e.g. a workspace chip. */
    renderComposerHeader?: ReactNode;
    /** Icon displayed by the return-to-latest button after scrolling away from the newest message. */
    scrollToLatestIcon?: string;
    /** Optional icon displayed by that button while an assistant message is streaming. */
    scrollToLatestBusyIcon?: string;
    icons?: AgentIcons;
};

declare const AgentChat: ({ agent, capabilities, composerControls, approval, brand, variant, renderSidebar, renderMarkdown, activityBlocks, activity, tools, connection, renderAboveMessages, onAdd, addButtonTitle, renderComposerHeader, scrollToLatestIcon, scrollToLatestBusyIcon, icons, }: AgentChatProps) => react.JSX.Element;

type AlertProps = BoxProps & {
    type?: ValueOf<typeof ALERT>;
    icon?: string;
    iconSize?: number;
    message?: string | ReactNode;
    title: string | ReactNode;
    variant?: ValueOf<typeof Variant>;
    actions?: ReactNode | {
        label: string;
        icon?: string | null;
        kind?: Appearance;
        onClick: () => void;
    }[];
};
interface AlertHandler {
    open: () => void;
    close: () => void;
}

/**
 * Alert component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Alert type="info">This is an informational alert</Alert>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Alert type="warning" dismissible onDismiss={() => console.log('dismissed')} icon="alert_circle">Warning: Please review the details</Alert>
 * ```
 * @param type - Component or input type
 * @param dismissible - dismissible prop
 * @param onDismiss - Callback function triggered on dismissal
 * @param icon - Icon identifier
 */
declare const Alert: react.ForwardRefExoticComponent<Omit<AlertProps, "ref"> & react.RefAttributes<AlertHandler>>;

/**
 * Pattern characters for mask validation:
 * - `0` - numeric (0-9)
 * - `A` - alphabetic (a-z, A-Z)
 * - `Z` - alphanumeric (a-z, A-Z, 0-9)
 * - `S` - special characters or any character
 * - Any other character is treated as a fixed separator
 */
type InputMaskOptions = {
    /**
     * Mask pattern with validation:
     * - Use `0` for numeric characters (0-9)
     * - Use `A` for alphabetic characters (a-z, A-Z)
     * - Use `Z` for alphanumeric characters (a-z, A-Z, 0-9)
     * - Use `S` for any character (no validation)
     * - Use any other character as fixed separator
     *
     * Example: '000A-BB123-BBBB9'
     * - First 3 digits must be numeric
     * - Next character must be alphabetic
     * - Next 2 characters must be alphabetic
     * - Next 3 digits must be numeric
     * - etc.
     */
    mask?: string;
    /**
     * Character to use as placeholder for validation (default: shows the pattern char)
     */
    placeholderChar?: string;
    /**
     * Whether to show mask on focus (default: true)
     */
    showMaskOnFocus?: boolean;
    /**
     * Whether to clear mask on blur when empty (default: false)
     */
    clearMaskOnBlur?: boolean;
    /**
     * Custom placeholder mask to display (if different from validation mask)
     * Example: mask='000A-BB123' placeholder='___A-BB123'
     */
    placeholder?: string;
};
type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>;
    numeric?: boolean;
    variant?: ValueOf<typeof Variant>;
    with?: WithFormValidation;
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void;
    /**
     * Mask options for input formatting
     */
    mask?: InputMaskOptions;
};

/**
 * Dynamic data configuration for AutoComplete API fetching
 */
type AutoCompleteDynamicOptions = {
    /**
     * API endpoint URL to fetch suggestions
     * Example: '/api/search'
     */
    action: string;
    /**
     * HTTP method for the request
     * @default 'POST'
     */
    method?: 'GET' | 'POST';
    /**
     * Query parameter name for the search query
     * @default 'query'
     */
    queryParam?: string;
    /**
     * Additional data to send with the request
     */
    params?: dynamic$1;
    /**
     * Custom response data transformer
     * receives response data and should return string array
     *
     * @example
     * ```tsx
     * transformResponse: (data) => data.results.map(item => item.name)
     * ```
     */
    transformResponse?: (data: dynamic$1) => string[];
    /**
     * Minimum characters before triggering search
     * @default 1
     */
    minChars?: number;
    /**
     * Debounce delay in milliseconds
     * @default 250
     */
    debounce?: number;
};
type AutoCompleteProps = Omit<InputProps, 'onSelect'> & {
    /**
     * Data source for suggestions
     *
     * Supports three formats:
     * 1. **Static string array**: ['Apple', 'Banana', 'Cherry']
     * 2. **Dynamic object array**: [{name: 'Apple'}, {name: 'Banana'}]
     * 3. **API configuration**: Use `dynamic` prop for server-side search
     *
     * When passing dynamic objects, use `dataKey` to specify which field (or fields) to use as the suggestion value.
     *
     * @example
     * ```tsx
     * // Static strings
     * data={['Apple', 'Banana', 'Cherry']}
     *
     * // Dynamic objects
     * data={[
     *   { id: 1, name: 'Apple', price: 1.99 },
     *   { id: 2, name: 'Banana', price: 0.99 }
     * ]}
     * dataKey="name"
     * ```
     */
    data?: string[] | dynamic$1[];
    /**
     * Field name(s) to extract from dynamic objects when `data` is an object array.
     *
     * A string uses one field. An array uses those fields in order: each
     * non-empty value is searchable, and they are joined with a space for the
     * suggestion label and committed input value. The first key is used when
     * wrapping a custom/string item (`{ [dataKey[0]]: value }`).
     *
     * If omitted, keys are inferred from string/number fields on objects in
     * `data` (or from API results). Falls back to `'name'` when nothing can
     * be inferred.
     *
     * @example
     * ```tsx
     * data={[{id: 1, name: 'Apple'}]}
     * dataKey="name"
     *
     * data={[{ firstName: 'Jane', lastName: 'Smith', email: 'jane@acme.com' }]}
     * dataKey={['firstName', 'lastName']}
     * ```
     */
    dataKey?: string | string[];
    /**
     * Dynamic API configuration for fetching suggestions from server
     * Use this for server-side search
     *
     * @example
     * ```tsx
     * dynamic={{
     *   action: '/api/search',
     *   method: 'POST',
     *   queryParam: 'q',
     *   transformResponse: (data) => data.items
     * }}
     * ```
     */
    dynamic?: AutoCompleteDynamicOptions;
    /**
     * Legacy action prop (deprecated, use dynamic.action instead)
     * @deprecated Use dynamic.action instead
     */
    action?: string;
    /**
     * Custom styling for the autocomplete container
     */
    withStyle?: string;
    /**
     * Callback when a suggestion is selected
     * When tokenize=true, this receives an array of selected values
     */
    onSelect?: (value: string | string[], item?: dynamic$1 | dynamic$1[]) => void;
    /**
     * Callback when input value changes
     */
    onChange?: (value: string) => void;
    /**
     * Callback when input value changes
     */
    clearOnSelect?: boolean;
    /**
     * When true, Enter commits the current input value as a string even if it
     * is not in the suggestion list. `onSelect` receives that string (and a
     * `{ [primaryDataKey]: value }` object, using the first `dataKey`). List
     * picks still send the matched item.
     */
    allowCustom?: boolean;
    /**
     * Custom renderer for suggestion items
     * Receives the suggestion string and index
     * For dynamic objects, item parameter contains the full object
     */
    renderOption?: (option: string, index: number, item?: dynamic$1) => React.ReactNode;
    /**
     * Placeholder for loading state
     * @default 'Loading...'
     */
    loadingPlaceholder?: string;
    /**
     * Placeholder when no results found
     * @default 'No results found'
     */
    emptyPlaceholder?: string;
    /**
     * Max Height
     */
    maxHeight?: number;
    /**
     * When true, selected items are displayed as removable tokens.
     * The `onSelect` callback will receive an array of selected values instead of a single value.
     *
     * @example
     * ```tsx
     * <AutoComplete
     *   data={['Apple', 'Banana', 'Cherry']}
     *   tokenize
     *   onSelect={(values) => console.log('Selected:', values)}
     * />
     * ```
     */
    tokenize?: boolean;
};

/**
 * AutoComplete component with support for static and dynamic data.
 *
 * @description
 * A searchable input component that provides suggestions from either:
 * - Static array of strings: ['Apple', 'Banana']
 * - Dynamic object array: [{name: 'Apple'}, {name: 'Banana'}]
 * - Dynamic API endpoint (dynamic prop with @zuzjs/core)
 *
 * @example
 * // Static string array
 * ```tsx
 * <AutoComplete
 *   data={["Apple", "Banana", "Cherry"]}
 *   placeholder="Search fruits..."
 * />
 * ```
 *
 * @example
 * // Dynamic object array (`dataKey` optional — inferred from object fields)
 * ```tsx
 * <AutoComplete
 *   data={[
 *     { id: 1, name: 'Apple', price: 1.99 },
 *     { id: 2, name: 'Banana', price: 0.99 }
 *   ]}
 *   dataKey="name"
 *   placeholder="Search fruits..."
 *   onSelect={(value, item) => console.log(value, item.price)}
 * />
 * ```
 *
 * @example
 * // Multiple object fields (search + joined label)
 * ```tsx
 * <AutoComplete
 *   data={[
 *     { firstName: 'Jane', lastName: 'Smith', email: 'jane@acme.com' }
 *   ]}
 *   dataKey={['firstName', 'lastName']}
 *   placeholder="Search people..."
 * />
 * ```
 *
 * @example
 * // Dynamic API search
 * ```tsx
 * <AutoComplete
 *   dynamic={{
 *     action: '/api/search',
 *     method: 'POST',
 *     queryParam: 'q',
 *     transformResponse: (data) => data.items
 *   }}
 *   placeholder="Search..."
 *   onSelect={(value) => console.log(value)}
 * />
 * ```
 *
 * @param data - Array of suggestions (strings or objects)
 * @param dataKey - Field(s) to extract from objects. If omitted, keys are inferred from `data`.
 * @param dynamic - Dynamic configuration for API fetching
 * @param onSelect - Callback when suggestion is selected
 * @param onChange - Callback when input value changes
 * @param renderOption - Custom renderer for suggestion items
 */
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

/**
 * Avatar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="User" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="User" size="lg" variant="rounded" />
 * ```
 * @param src - Source URL
 * @param alt - Alt text
 * @param size - Component size
 * @param variant - Visual variant or style
 */
declare const Avatar: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof AVATAR>;
    size?: number;
    variant?: ValueOf<typeof Variant>;
    src?: string;
    color?: string;
    crossOrigin?: "anonymous" | "use-credentials";
    referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
} & react.RefAttributes<AvatarHandler>>;

declare const SPINNER: {
    readonly Simple: "SIMPLE";
    readonly Roller: "ROLLER";
    readonly Wave: "Wave";
};
type SpinnerProps = BoxProps & {
    type?: ValueOf<typeof SPINNER>;
    variant?: ValueOf<typeof Variant>;
};

interface ToolTipController {
    setPosition: (pos: {
        x: number;
        y: number;
    }) => void;
    show: () => void;
    hide: () => void;
}
type ToolTipTransition = `slide` | `scale` | `none`;
type ToolTipProps = Omit<BoxProps, `title` | `ref` | `transition`> & {
    position?: ValueOf<typeof POSITION>;
    margin?: number;
    title?: string | ReactNode;
    show?: boolean;
    variant?: ValueOf<typeof Variant>;
    /** Tooltip will be anchored to this className in children */
    anchorName?: string;
    transition?: ToolTipTransition;
};

type BadgeProps = BoxProps & {
    /** Badge size. */
    size?: number;
    /** Badge type. */
    type?: ValueOf<typeof Status>;
    /** Badge variant. */
    variant?: ValueOf<typeof Variant>;
    /** Badge appearance kind. */
    kind?: Appearance;
    /** Icon to display inside the badge. */
    icon?: string | null;
    /** Text label. Ignored when `count` is provided. */
    label?: string;
    /** Numeric count to display. Renders a label badge with the count. */
    count?: number;
    /** Cap for `count` — values above this render as `{max}+`. Defaults to 99. */
    max?: number;
    /** Custom color that overrides the semantic `type` color. Accepts any CSS color value. */
    color?: string;
    /** Custom color for the label text. Accepts any CSS color value. */
    labelColor?: string;
    /** Whether the badge is in a loading state. */
    loading?: boolean;
    /** Spinner type to display when `loading` is true. */
    spinner?: ValueOf<typeof SPINNER>;
    /** Whether the badge content should be reversed. */
    reverse?: boolean;
    tooltip?: string;
    tooltipProps?: Omit<ToolTipProps, `title`>;
};
declare const Badge: react__default.FC<BadgeProps>;

/**
 * Box component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Box>Content goes here</Box>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Box padding="lg" variant="subtle" borderRadius="md" shadow="sm">Styled container with spacing and effects</Box>
 * ```
 * @param padding - padding prop
 * @param variant - Visual variant or style
 * @param borderRadius - borderRadius prop
 * @param shadow - shadow prop
 */
declare const Box: {
    ({ ref, style, scrollPhysics, scrollContainer, ...props }: BoxProps): react.JSX.Element;
    displayName: string;
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
    tooltip?: string;
    tooltipProps?: Omit<ToolTipProps, `title`>;
    kind?: Appearance;
    alignment?: `start` | `center` | `end`;
    reverse?: boolean;
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

/**
 * Button component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Button onClick={() => console.log("clicked")}>Click me</Button>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Button kind="solid" variant="primary" icon="check" state="loading" spinner="simple">Save Changes</Button>
 * ```
 * @param onClick - Callback function triggered on click
 * @param kind - kind prop
 * @param variant - Visual variant or style
 * @param icon - Icon identifier
 * @param state - state prop
 * @param spinner - spinner prop
 */
declare const Button: {
    ({ ref, ...props }: ButtonProps): react.JSX.Element;
    displayName: string;
};

type CalendarRangeValue = {
    start: Date | null;
    end: Date | null;
};
type CalendarChangeSource = "day" | "month" | "time" | "week" | "year" | "today";
type CalendarDisabledDateInput = string | Date;
type CalendarQuickOptionLabel = "Today" | "Later" | "Tomorrow" | "This weekend" | "Next week" | "Next weekend" | "2 weeks" | "4 weeks";
type CalendarQuickOptionInput = CalendarQuickOptionLabel | CalendarDisabledDateInput;
type CalendarViewMode = "day" | "week" | "month" | "year";
type CalendarTimeSlot = {
    date: Date;
    timeStart: string;
    timeEnd: string;
};
type CalendarTimeRange = {
    start: CalendarTimeSlot;
    end: CalendarTimeSlot;
};
type CalendarAppointment = {
    id: string | number;
    date: Date;
    timeStart: string;
    timeEnd: string;
    duration?: number;
    title?: string;
    data?: dynamic$1;
};
/** Information about an appointment overlap conflict */
type CalendarAppointmentOverlap = {
    /** The appointment being added/modified */
    appointment: CalendarAppointment;
    /** The existing appointment that overlaps */
    conflictingAppointment: CalendarAppointment;
    /** The date of the overlap */
    date: Date;
};
type CalendarAppointmentRenderProps = {
    /** The appointment data */
    appointment: CalendarAppointment;
    /** Style object (empty - positioning is handled internally) */
    style: React.CSSProperties;
};
/** Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
type CalendarWeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** Drag mode for appointment operations */
type CalendarDragMode = "rightClickDrag" | "ctrlClickDrag";
/** Disabled time range within a day */
type CalendarDisabledTimeRange = {
    /** Start time in HH:mm format */
    timeStart: string;
    /** End time in HH:mm format */
    timeEnd: string;
};
type CalendarProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    range?: boolean;
    rangeValue?: CalendarRangeValue;
    defaultRangeValue?: CalendarRangeValue;
    variant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null, meta?: {
        source: CalendarChangeSource;
    }) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    selectYear?: boolean;
    name?: string;
    /** Large calendar mode for scheduling views */
    large?: boolean;
    /** View mode for large calendar - default: week */
    viewMode?: CalendarViewMode;
    /** Start date for the view (defaults to today or value) */
    startDate?: Date;
    /** Day of the week to start (0=Sunday, 1=Monday, etc.) - default: 1 (Monday) */
    weekStartsOn?: CalendarWeekStartDay;
    /** Time interval in minutes - default: 60 (main slot size) */
    timeInterval?: number;
    /** Sub-interval in minutes for clickable slots within main intervals - e.g., 15 for 15-min slots within 1-hour intervals */
    subInterval?: number;
    /** Whether to show labels for sub-intervals - default: false (only main intervals are labeled) */
    showSubIntervalLabel?: boolean;
    /** Start hour (0-23) - default: 8 */
    startHour?: number;
    /** End hour (0-23) - default: 20 */
    endHour?: number;
    /** Appointments to render on the calendar */
    appointments?: CalendarAppointment[];
    /** Custom render for appointment blocks */
    renderAppointment?: (props: CalendarAppointmentRenderProps) => ReactNode;
    /** Custom render for appointment ghost preview during drag (falls back to renderAppointment, then default) */
    renderAppointmentGhost?: (props: CalendarAppointmentRenderProps) => ReactNode;
    /** Callback when clicking on a time slot */
    onTimeSlotClick?: (slot: CalendarTimeSlot) => void;
    /** Callback when clicking on an appointment */
    onAppointmentClick?: (appointment: CalendarAppointment) => void;
    /** Callback when an appointment is moved or resized */
    onAppointmentChange?: (appointment: CalendarAppointment) => void;
    /** Enable multi-select by clicking and dragging across time slots */
    enableRangeSelect?: boolean;
    /** Callback when a time range is selected (when enableRangeSelect is true) */
    onTimeRangeSelect?: (range: CalendarTimeRange) => void;
    /** Disable dates after a specific threshold: 'today', 'next-week', or a specific Date */
    disableAfter?: 'today' | 'next-week' | Date;
    /** Drag mode for appointments - default: "rightClickDrag" */
    dragMode?: CalendarDragMode;
    /** Whether appointments can be dragged - default: true */
    canDrag?: boolean;
    /** Whether appointments can be resized - default: true */
    canResize?: boolean;
    /** Callback when an appointment overlaps with an existing appointment */
    onAppointmentOverlap?: (overlap: CalendarAppointmentOverlap) => void;
    /** Disabled time ranges (time of day that is disabled) */
    disabledTimeRanges?: CalendarDisabledTimeRange[];
    /** Prevent adding/moving appointments in past dates */
    disablePastDates?: boolean;
    /** Prevent adding/moving appointments in future dates */
    disableFutureDates?: boolean;
    /** Callback to determine if a specific date is disabled */
    isDateDisabled?: (date: Date) => boolean;
    /** Called when the user switches Day/Week/Month/Year via the segmented control */
    onViewModeChange?: (viewMode: CalendarViewMode) => void;
};
type LargeCalendarProps = Pick<CalendarProps, 'value' | 'defaultValue' | 'variant' | 'viewMode' | 'startDate' | 'weekStartsOn' | 'timeInterval' | 'subInterval' | 'showSubIntervalLabel' | 'startHour' | 'endHour' | 'appointments' | 'renderAppointment' | 'renderAppointmentGhost' | 'onTimeSlotClick' | 'onAppointmentClick' | 'onAppointmentChange' | 'enableRangeSelect' | 'onTimeRangeSelect' | 'disableAfter' | 'dragMode' | 'canDrag' | 'canResize' | 'onAppointmentOverlap' | 'disabledTimeRanges' | 'disablePastDates' | 'disableFutureDates' | 'isDateDisabled' | 'onViewModeChange'> & {
    visibleMonth: Date;
    themeVariant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null) => void;
    setVisibleMonth: (date: Date) => void;
};

/**
 * Calendar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} selected={new Date()} minDate={new Date(2024, 0, 1)} maxDate={new Date()} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param selected - Currently selected item/date
 * @param minDate - minDate prop
 * @param maxDate - maxDate prop
 */
declare const Calendar: react.ForwardRefExoticComponent<CalendarProps & react.RefAttributes<HTMLInputElement>>;

type CarouselEffect = 'slide' | 'coverflow' | 'fade' | 'stack';
type LoopMode = 'jump' | 'infinite';
type CarouselProps<T> = BoxProps & {
    items: T[];
    renderItem: (item: T, index: number, activeIndex: number) => ReactNode;
    effect?: CarouselEffect;
    loop?: boolean;
    loopMode?: LoopMode;
    startIndex?: number;
    useKeys?: boolean;
    useWheel?: boolean;
    spacing?: number;
    rotation?: number;
    blur?: number;
    animation?: AnimationTransition;
    scaleStep?: number;
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    showDots?: boolean;
    onChange?: (index: number) => void;
};

declare function CarouselInner<T>(props: CarouselProps<T>, ref: React.ForwardedRef<HTMLDivElement>): react.JSX.Element;
/**
 * Carousel component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Carousel><div>Slide 1</div><div>Slide 2</div><div>Slide 3</div></Carousel>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Carousel autoplay interval={5000} onSlideChange={(index) => console.log(index)} controls="dots"><div>Slide 1</div><div>Slide 2</div></Carousel>
 * ```
 * @param autoplay - Whether carousel autoplays
 * @param interval - Autoplay interval in milliseconds
 * @param onSlideChange - Callback function triggered on slide change
 * @param controls - controls prop
 */
declare const Carousel: <T>(props: CarouselProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
}) => ReturnType<typeof CarouselInner>;

declare enum CHART {
    Line = "line"
}
type ChartProps = BoxProps & LineChartProps & {
    type?: CHART;
    animDuration?: number;
    animDelay?: number;
};

/**
 * Chart component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Chart type="line" data={[{ x: "Jan", y: 10 }, { x: "Feb", y: 20 }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Chart type="bar" data={[{ x: "Q1", y: 100 }, { x: "Q2", y: 150 }]} xKey="x" yKey="y" title="Quarterly Revenue" />
 * ```
 * @param type - Component or input type
 * @param data - Data for visualization
 * @param xKey - xKey prop
 * @param yKey - yKey prop
 * @param title - Title text or element
 */
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
declare enum BubbleAttachmentType {
    ReactNode = "custom",
    Text = "text",
    File = "file",
    Image = "image",
    Video = "video",
    Audio = "audio",
    Link = "link"
}
type BubbleStylePreset = "default" | "ios" | "android" | "blocks" | "glass" | "minimal";
type BubbleAttachment = {
    id?: string | number;
    type: BubbleAttachmentType.ReactNode;
    content: ReactNode;
    name?: string;
    url?: string;
    size?: string;
    preview?: string;
} | {
    id?: string | number;
    type?: BubbleAttachmentType;
    content?: never;
    name: string;
    url: string;
    size?: string;
    preview?: string;
};
type BubbleProps = BoxProps & {
    id?: string | number;
    sender?: {
        id: string;
        name: string;
        picture?: string;
        color?: string;
    };
    text?: string;
    hideAvatar?: boolean;
    avatarType?: ValueOf<typeof AVATAR>;
    hideName?: boolean;
    media?: {
        type: BubbleMediaType;
        source: string;
        duration?: string;
        thumbnail?: string;
        title?: string;
    };
    side?: "me" | "you";
    stylePreset?: BubbleStylePreset;
    status?: BubbleStatus;
    timeStamp?: number;
    arrow?: boolean;
    attachments?: BubbleAttachment[];
    /** Auto-fetch and display link previews from URLs in text */
    autoFetchLinkPreview?: boolean;
    /** Optional custom preview fetcher for links found in text */
    linkPreviewFetcher?: (url: string) => Promise<{
        title?: string;
        description?: string;
        image?: string;
        url?: string;
    } | null>;
    /** Message this bubble is replying to */
    replyTo?: {
        author: string;
        text: string;
        id?: string | number;
    };
    /** Array of emoji reactions */
    reactions?: string[];
    /** Whether this message is forwarded */
    forwarded?: boolean;
    /** Complex nested content support */
    children?: ReactNode;
};

declare const Bubble: react__default.MemoExoticComponent<({ ref, ...props }: BubbleProps & {
    ref?: Ref<HTMLDivElement>;
}) => react__default.JSX.Element>;

type ChatMessage = BubbleProps;
type ChatDateLabels = {
    today?: ReactNode;
    yesterday?: ReactNode;
};
type ChatDateLabelFormatter = (timeStamp: number, context: {
    date: Date;
    dayDiff: number;
    locale?: string;
    labels: Required<ChatDateLabels>;
}) => ReactNode;
interface ChatListProps {
    messages: ChatMessage[];
    autoScroll?: boolean;
    smoothScroll?: boolean;
    bottomThreshold?: number;
    onScrollTop?: () => void;
    typing?: boolean | string;
    dateLabels?: ChatDateLabels;
    locale?: string;
    formatDateLabel?: ChatDateLabelFormatter;
    hideAvatar?: boolean;
    avatarType?: ValueOf<typeof AVATAR>;
    hideName?: boolean;
}

/**
 * ChatList component optimized for performance with auto-scroll and unread indicator.
 * - Auto scrolls to bottom when new messages arrive
 * - Allows manual scroll without disruption
 * - Shows unread message count when scrolled up
 * - Memoizes child components for optimal rendering
 */
declare const ChatList: react.MemoExoticComponent<({ messages, autoScroll, smoothScroll, bottomThreshold, onScrollTop, typing, dateLabels, locale, formatDateLabel, hideAvatar, hideName, arrow, avatarType }: ChatListProps & BubbleProps) => react.JSX.Element>;

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

/**
 * CheckBox component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <CheckBox label="I agree" onChange={(checked) => console.log(checked)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <CheckBox label="Remember me" defaultChecked={true} disabled={false} variant="primary" />
 * ```
 * @param label - Label text for the component
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param variant - Visual variant or style
 */
declare const CheckBox: {
    ({ ref, ...props }: CheckBoxProps & {
        ref?: Ref<CheckboxHandler>;
    }): react.JSX.Element;
    displayName: string;
};

type CodeLanguage = BundledLanguage | 'plain';
interface CodeBlockProps extends ZuzProps {
    ref?: Ref<HTMLPreElement>;
    code: string;
    lang?: CodeLanguage;
    showLines?: boolean;
    highlight?: string;
    theme?: BundledTheme;
    themeDark?: BundledTheme;
    themeLight?: BundledTheme;
    copy?: {
        onCopy?: () => void;
        icon?: string;
    };
}

declare const CodeBlock: ({ ref, ...props }: CodeBlockProps) => react.JSX.Element;

/**
 * Individual segment in the `SelectTabs` component.
 * @typedef {Object} Segment
 * @property {number} index - The index of the segment.
 * @property {string} [icon] - The optional icon to display for the segment.
 * @property {string} [label] - The optional label to display for the segment.
 */
interface Segment {
    tag?: string | number;
    index?: number;
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
    disabled?: boolean;
    variant?: ValueOf<typeof Variant>;
    selected?: number;
    onSwitch?: (segment: Segment) => void;
    items: Segment[];
};
type SegmentItemProps = {
    meta: Segment;
    selected: boolean;
    onSelect: (index: number, width: number, x: number, segment: Segment, force: boolean) => void;
    disabled?: boolean;
};
interface SegmentController {
    setSelected: (index: number) => void;
}

type ColorSchemeProps = Omit<SegmentProps, `items`> & {
    type?: "switch" | "toggle" | "system";
};

/**
 * ColorScheme component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ColorScheme type="system" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ColorScheme type="light" variant="sm" onChange={(scheme) => console.log(scheme)} />
 * ```
 * @param type - Component or input type
 * @param variant - Visual variant or style
 * @param onChange - Callback function triggered when value changes
 */
declare const ColorScheme$1: react.ForwardRefExoticComponent<Omit<ColorSchemeProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type ColorValue = {
    hex: string;
    rgb: {
        r: number;
        g: number;
        b: number;
    };
    hsv: {
        h: number;
        s: number;
        v: number;
    };
    alpha: number;
};
type ColorPickerProps = Omit<InputProps, 'onChange'> & {
    defaultValue?: string;
    colorValue?: string;
    alpha?: boolean;
    format?: 'hex' | 'rgb';
    kind?: 'square' | 'expanded';
    size?: number;
    onColorChange?: (color: ColorValue) => void;
};

/**
 * ColorPicker component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ColorPicker onColorChange={(color) => console.log(color.hex)} />
 * ```
 *
 * @example
 * // With alpha and controlled value
 * ```tsx
 * <ColorPicker colorValue="#ff5733" alpha onColorChange={(c) => setColor(c)} />
 * ```
 *
 * @param colorValue   - Controlled hex color string
 * @param defaultValue - Initial hex color string (uncontrolled)
 * @param alpha        - Show alpha/opacity slider
 * @param format       - Display format in the trigger input: 'hex' | 'rgb'
 * @param onColorChange - Callback fired on every color change
 */
declare const ColorPicker: react.ForwardRefExoticComponent<Omit<ColorPickerProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

/**
 * Represents a single menu item in the context menu.
 */
type ContextItem = ContextItemConfig | ReactNode | FC;
type ContextMenuArrowSide = "top" | "left" | "right" | "bottom";
type ContextMenuArrowAlign = "left" | "center" | "right" | "top" | "bottom";
interface ContextItemConfig {
    /** The display text for the menu item */
    label: string | ReactNode;
    /** Optional color for the label text */
    labelColor?: string;
    /** Optional icon identifier or class name */
    icon?: string | ReactNode;
    /** Optional color for the icon */
    iconColor?: string;
    /** Optional CSS class to apply to the menu item */
    className?: string;
    /** Whether the menu item is enabled and selectable */
    enabled?: boolean;
    /** Callback function invoked when the menu item is selected */
    onSelect?: (item: ContextItemConfig) => void;
    /** Optional nested submenu items */
    submenu?: ContextItem[];
    /** Action */
    action?: react__default.ReactNode;
}
/**
 * Props for the ContextMenu component.
 * Extends the BoxProps interface with context menu specific properties.
 */
type ContextMenuProps = BoxProps & {
    /** Unique identifier for the context menu instance */
    id?: number;
    /** The mouse or touch event that triggered the context menu */
    event?: MouseEvent$1<Element, MouseEvent> | TouchEvent;
    /** Reference to the parent HTML element */
    parent?: RefObject<HTMLElement | null>;
    /** The origin point for positioning the context menu */
    origin?: ValueOf<typeof ORIGIN>;
    /** Array of menu items to display */
    items?: ContextItem[];
    /** Horizontal offset in pixels from the trigger point */
    offsetX?: number;
    /** Vertical offset in pixels from the trigger point */
    offsetY?: number;
    /** Optional header component or ReactNode to display at the top */
    header?: ReactNode | FC;
    /** Optional footer component or ReactNode to display at the bottom */
    footer?: ReactNode | FC;
    /** Conditional flag to control whether the context menu is displayed */
    when?: boolean;
    /** Arrow */
    arrow?: boolean;
    /** Force arrow side independent of origin/auto placement */
    arrowSide?: ContextMenuArrowSide;
    /** Force arrow alignment on the selected side */
    arrowAlign?: ContextMenuArrowAlign;
    /** Width of the context menu */
    width?: number | string;
    /** Callback invoked when the context menu is closed with its id */
    onClose?: (id: number) => void;
};
/**
 * Props for individual MenuItem components.
 * Extends ContextItem with additional rendering properties.
 */
type MenuItemProps = ContextItemConfig & {
    /** Index position of the menu item in the menu list */
    index: number;
    /** Whether this item opens a submenu */
    hasSubmenu?: boolean;
    /** Mouse enter handler for submenu anchoring */
    onHover?: () => void;
    /** Attach ref to the clickable item root */
    itemRef?: (node: HTMLButtonElement | null) => void;
};
/**
 * Handler interface for imperative control of the ContextMenu component.
 * Used with useRef and forwardRef for programmatic visibility control.
 */
interface ContextMenuHandler {
    /**
     * Display the context menu at the position of the provided event.
     * @param e - The mouse or touch event that triggered the menu
     * @param items - Optional array of menu items to display
     */
    show: (e: MouseEvent$1<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    /**
     * Hide/close the context menu.
     * @param e - The mouse or touch event that triggered the close action
     */
    hide: (e: MouseEvent$1 | TouchEvent) => void;
}

/**
 * ContextMenu component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ContextMenu items={[{ label: "Edit" }, { label: "Delete" }]}>Right-click here</ContextMenu>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ContextMenu items={[{ label: "Copy", icon: "copy" }, { label: "Paste", icon: "paste" }]} onSelect={(item) => console.log(item)}>Content</ContextMenu>
 * ```
 * @param items - Array of items
 * @param onSelect - Callback function triggered on selection
 */
declare const ContextMenu: {
    ({ ref, ...props }: ContextMenuProps & {}): react.JSX.Element;
    displayName: string;
};

type CookieConsentProps = {
    title?: string;
    message?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    position?: ValueOf<typeof Position>;
    variant?: ValueOf<typeof Variant>;
    onAccept?: () => void;
    onReject?: () => void;
};

/**
 * CookiesConsent component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <CookiesConsent message="We use cookies to enhance your experience" onAccept={() => console.log("accepted")} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <CookiesConsent title="Cookie Policy" message="Help us improve..." acceptLabel="I agree" rejectLabel="Decline" onAccept={() => {}} onReject={() => {}} />
 * ```
 * @param message - Message text or element
 * @param onAccept - onAccept prop
 * @param title - Title text or element
 * @param acceptLabel - acceptLabel prop
 * @param rejectLabel - rejectLabel prop
 */
declare const CookiesConsent: react.ForwardRefExoticComponent<CookieConsentProps & react.RefAttributes<HTMLDivElement>>;

type CoverProps = BoxProps & {
    message?: string;
    spinner?: ValueOf<typeof SPINNER>;
    spinnerSize?: ValueOf<typeof Variant>;
    color?: string;
    when?: boolean;
    hideMessage?: boolean;
};
/**
 * Cover component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Cover src="https://example.com/image.jpg" alt="Cover image" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Cover src="https://example.com/image.jpg" alt="Cover" objectFit="cover" height="400px" />
 * ```
 * @param src - Source URL
 * @param alt - Alt text
 * @param objectFit - objectFit prop
 * @param height - height prop
 */
declare const Cover: react.ForwardRefExoticComponent<Omit<CoverProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare enum CropShape {
    Circle = "circle",
    Square = "square"
}
type CropperProps = BoxProps & {
    src: string;
    shape?: CropShape;
    size?: number;
    value?: number;
};
interface CropHandler {
    getCropped: () => string;
    setScale: (scale: number) => void;
}

/**
 * Cropper component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Cropper src="https://example.com/image.jpg" onCrop={(data) => console.log(data)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Cropper src="https://example.com/image.jpg" aspectRatio={16/9} onCrop={(data) => console.log(data)} guides />
 * ```
 * @param src - Source URL
 * @param aspectRatio - aspectRatio prop
 * @param onCrop - Callback function triggered on crop action
 * @param guides - guides prop
 */
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
    variant?: ValueOf<typeof Variant>;
    separator?: "arrow" | "slash" | "dot" | ReactNode;
};

/**
 * Crumb component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Crumb items={[{ label: "Home" }, { label: "Products" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Crumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Shoes" }]} separator="/" />
 * ```
 * @param items - Array of items
 * @param separator - separator prop
 */
declare const Crumb: react.ForwardRefExoticComponent<Omit<CrumbProps, "ref"> & react.RefAttributes<HTMLOListElement | HTMLUListElement>>;

type DatePickerMode = "date" | "time";
type DatePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
    /** Mode: "date" (default) or "time" */
    mode?: DatePickerMode;
    defaultValue?: Date | null;
    dateValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    range?: boolean;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    defaultRangeValue?: CalendarRangeValue;
    rangeValue?: CalendarRangeValue;
    onDateChange?: (date: Date | null) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    displayFormat?: string;
    value?: string;
    selectYear?: boolean;
    /** Use 12-hour format (AM/PM) for time mode */
    use12Hours?: boolean;
    /** Show seconds in time mode */
    showSeconds?: boolean;
    /** Minute step interval for time mode */
    minuteStep?: number;
};

/**
 * DatePicker component.
 *
 * @example
 * // Basic usage - date mode (default)
 * ```tsx
 * <DatePicker onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Time mode
 * ```tsx
 * <DatePicker mode="time" onDateChange={(date) => console.log(date)} use12Hours />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <DatePicker onChange={(date) => console.log(date)} selected={new Date()} format="MM/dd/yyyy" disabled={false} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param selected - Currently selected item/date
 * @param format - format prop
 * @param disabled - Whether component is disabled
 * @param mode - "date" (default) or "time"
 */
declare const DatePicker: react.ForwardRefExoticComponent<Omit<DatePickerProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type TimePickerValue = {
    hour: number;
    minute: number;
    second?: number;
    period?: "AM" | "PM";
};
/** Value type that accepts TimePickerValue, ISO Date string, or Date object */
type TimePickerInputValue = TimePickerValue | string | Date;
type TimePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
    /** Default time value - accepts TimePickerValue, ISO Date string, or Date object */
    defaultValue?: TimePickerInputValue | null;
    /** Controlled time value - accepts TimePickerValue, ISO Date string, or Date object */
    timeValue?: TimePickerInputValue | null;
    /** Use 12-hour format (AM/PM) instead of 24-hour */
    use12Hours?: boolean;
    /** Show seconds picker */
    showSeconds?: boolean;
    /** Minimum time (hour in 24h format) */
    minHour?: number;
    /** Maximum time (hour in 24h format) */
    maxHour?: number;
    /** Step interval for minutes */
    minuteStep?: number;
    /** Step interval for seconds */
    secondStep?: number;
    /** Display format - defaults to "HH:mm" or "HH:mm:ss" if showSeconds */
    displayFormat?: string;
    /** Custom value for input */
    value?: string;
    /** Callback when time changes */
    onTimeChange?: (time: TimePickerValue | null) => void;
    /** Callback when Enter is pressed */
    onConfirm?: (value: string) => void;
};

/**
 * TimePicker component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TimePicker onTimeChange={(time) => console.log(time)} />
 * ```
 *
 * @example
 * // Advanced usage with 12-hour format
 * ```tsx
 * <TimePicker onTimeChange={(time) => console.log(time)} use12Hours showSeconds />
 * ```
 *
 * @example
 * // Using ISO Date string
 * ```tsx
 * <TimePicker defaultValue="2024-01-15T14:30:00" onTimeChange={(time) => console.log(time)} />
 * ```
 *
 * @example
 * // Using Date object
 * ```tsx
 * <TimePicker defaultValue={new Date()} onTimeChange={(time) => console.log(time)} />
 * ```
 * @param onTimeChange - Callback function triggered when time changes
 * @param timeValue - Currently selected time
 * @param use12Hours - Whether to use 12-hour format
 * @param showSeconds - Whether to show seconds
 */
declare const TimePicker: react.ForwardRefExoticComponent<Omit<TimePickerProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

interface DependencyTreeNode {
    id: string;
    label?: string;
    meta?: dynamic$1;
    status: 'root' | 'merged' | 'active' | 'blocked';
    level?: number;
    color?: string;
    lineColor?: string;
    badgeColor?: string;
    badgeTextColor?: string;
    cardColor?: string;
    textColor?: string;
}
interface DependencyTreeRenderContext {
    isCurrent: boolean;
    mode: 'list' | 'pyramid';
    variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showBadge: boolean;
    index: number;
    rowIndex?: number;
}
type DependencyTreeRenderNode = (node: DependencyTreeNode, context: DependencyTreeRenderContext, index: number) => ReactNode;
interface DependencyTreeProps {
    currentId?: string;
    nodes: DependencyTreeNode[];
    mode?: 'list' | 'pyramid';
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showBadge?: boolean;
    renderNode?: DependencyTreeRenderNode;
}

declare const DependencyTree: ({ currentId, nodes, mode, variant, showBadge, renderNode, }: DependencyTreeProps) => react.JSX.Element;

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
/**
 * Sheet component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Sheet isOpen={true} onClose={() => setOpen(false)}>Content here</Sheet>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Sheet isOpen={true} onClose={() => setOpen(false)} position="bottom" size="md" backdrop>Bottom sheet</Sheet>
 * ```
 * @param isOpen - Whether sheet is open
 * @param onClose - Callback function triggered when closing
 * @param position - position prop
 * @param size - Component size
 * @param backdrop - backdrop prop
 */
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

type ValidationSchema = Record<string, (value: any, allValues: dynamic) => string | null | boolean>;
type ValidationResult = {
    [key: string]: {
        valid: boolean;
        value: string;
    };
};
type FormProps = Omit<BoxProps, `ref`> & {
    schema?: ValidationSchema;
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
    beforeSubmit?: (data: FormData | dynamic, validationResult: ValidationResult) => void;
    /** Handler function called on form submission with validated form data */
    onSubmit?: (data: FormData | dynamic, validationResult: ValidationResult) => void;
    /** Callback triggered upon successful form submission */
    onSuccess?: (data: dynamic, payload?: dynamic) => void;
    /** Callback triggered when form submission encounters an error */
    onError?: (error: any, validationResult: ValidationResult) => void;
    /** Cover properties to display loading or processing message */
    cover?: {
        /** Background color of the loading cover */
        color?: string;
        /** Message displayed during loading */
        message?: string;
    } | SheetHandler;
    resetOnSuccess?: boolean;
};
type FormDataResult = {
    error: boolean;
    errorMsg: string;
    data: ValidationResult;
    payload: FormData | dynamic;
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
    /** Retrieves the current form data */
    getFormData: () => FormDataResult;
    /** Submits the form with optional additional data */
    submit: (more?: dynamic) => void;
}

type DialogConfirmOptions = {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
};
/** Pass `true` for default confirm text, or options to customize it. */
type DialogConfirmClose = boolean | DialogConfirmOptions;
type DialogContextType = {
    setDirty: (dirty: boolean) => void;
    isDirty: boolean;
};
type DialogProps = ZuzProps & {
    id?: number;
    /** The title of the dialog */
    title?: string | ReactNode;
    /** The description of the dialog */
    description?: string | ReactNode;
    /** The alignment of the title */
    titleAlignment?: `left` | `center` | `right`;
    /** The message of the dialog */
    message?: string | ReactNode;
    /** The content of the dialog */
    content?: string | ReactNode;
    /** The width of the dialog */
    width?: number | string;
    /** The transition of the dialog */
    transition?: ValueOf<typeof TRANSITIONS>;
    /** The curve of the dialog */
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    /** The speed of the dialog */
    speed?: number;
    /** The delay of the dialog */
    delay?: number;
    /** The type of the dialog */
    type?: ValueOf<typeof DIALOG>;
    /** The spinner of the dialog */
    spinner?: ValueOf<typeof SPINNER>;
    /** The loading message of the dialog */
    loadingMessage?: string;
    /** The actions of the dialog */
    action?: DialogActionHandler[];
    /** The position of the actions */
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>;
    /** The variant of the dialog */
    variant?: ValueOf<typeof Variant>;
    /** WithForm */
    useForm?: boolean;
    formProps?: FormProps;
    /** Additional CSS classes to apply to the dialog */
    withClass?: string;
    /** If true, the dialog will not render a header */
    noHead?: boolean;
    /** Close when the overlay is clicked. @default true */
    hideOnClickOutside?: boolean;
    onConfirm?: (data?: dynamic$1, validateResult?: ValidationResult) => void;
    onCancel?: () => void;
    onShow?: () => void;
    onHide?: () => void;
    /** When truthy, close attempts (overlay/ESC/close button) ask before discarding dirty form changes. */
    confirmClose?: DialogConfirmClose;
    /** Externally controlled dirty state. */
    dirty?: boolean;
} & LayerHandler;
interface DialogActionHandler {
    key?: string;
    label: string;
    kind?: Appearance;
    type?: "button" | "reset" | "submit";
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

declare const DialogContext: react.Context<DialogContextType | null>;
declare const useDialogDirty: () => DialogContextType | null;
/**
 * Dialog component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Dialog title="Confirm" message="Are you sure?" action={[{ label: "OK" }, { label: "Cancel" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Dialog title="Save Changes?" message="Your edits will be lost" type="warning" action={[{ label: "Save", handler: () => {} }, { label: "Discard" }]} onShow={() => console.log("shown")} />
 * ```
 * @param title - Title text or element
 * @param message - Message text or element
 * @param type - Component or input type
 * @param action - action prop
 * @param onShow - Callback function triggered when showing
 */
declare const Dialog: {
    ({ ref, ...props }: DialogProps & {
        index: number;
        onClose: (id: number) => void;
        ref?: Ref<DialogHandler>;
    }): react.JSX.Element;
    displayName: string;
};

type DrawerConfirmOptions = {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
};
/** Pass `true` for default confirm text, or an options object to customise the dialog. */
type DrawerConfirmClose = boolean | DrawerConfirmOptions;
type DrawerContextType = {
    /** Mark the drawer as having unsaved changes. */
    setDirty: (dirty: boolean) => void;
    isDirty: boolean;
};
type DrawerProps = Omit<BoxProps, `id`> & {
    id?: number;
    index?: number;
    as?: string;
    speed?: number;
    from?: ValueOf<typeof DRAWER_SIDE>;
    children?: string | ReactNode | ReactNode[];
    prerender?: boolean;
    margin?: number;
    animation?: ValueOf<typeof TRANSITION_CURVES>;
    closeBtn?: Extract<Placement, "left" | "right">;
    onClose?: (id: number) => void;
    /** Close when the overlay is clicked. @default true */
    hideOnClickOutside?: boolean;
    /** When truthy, overlay / ESC close is gated by a "Discard changes?" confirm when dirty. */
    confirmClose?: DrawerConfirmClose;
    /** Externally controlled dirty state (synced to internal dirty state). */
    dirty?: boolean;
} & LayerHandler;
interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void;
    close: () => void;
}

declare const DrawerContext: react.Context<DrawerContextType | null>;
/** Use inside any component rendered inside a Drawer to mark it as having unsaved changes. */
declare const useDrawerDirty: () => DrawerContextType | null;
/**
 * Drawer component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Drawer open={true} onClose={() => setOpen(false)}>Drawer content here</Drawer>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Drawer open={true} onClose={() => setOpen(false)} position="right" size="lg" variant="overlay">Navigation menu</Drawer>
 * ```
 * @param open - Whether drawer/sheet is open
 * @param onClose - Callback function triggered when closing
 * @param position - position prop
 * @param size - Component size
 * @param variant - Visual variant or style
 */
declare const Drawer: {
    ({ ref, ...props }: DrawerProps & {
        ref?: Ref<HTMLDivElement>;
    }): react.JSX.Element;
    displayName: string;
};

declare const SVGIcons: {
    colorSchemeLight: react.JSX.Element;
    colorSchemeSystem: react.JSX.Element;
    colorSchemeDark: react.JSX.Element;
    arrowDown: react.JSX.Element;
    arrowUp: react.JSX.Element;
    search: react.JSX.Element;
    send: react.JSX.Element;
    stop: react.JSX.Element;
    model: react.JSX.Element;
    thinking: react.JSX.Element;
    list: react.JSX.Element;
    todo: react.JSX.Element;
    document: react.JSX.Element;
    terminal: react.JSX.Element;
    write: react.JSX.Element;
    read: react.JSX.Element;
    magic: react.JSX.Element;
    copy: react.JSX.Element;
    branch: react.JSX.Element;
    close: react.JSX.Element;
    eye: react.JSX.Element;
    eyeSlash: react.JSX.Element;
    check: react.JSX.Element;
    info: react.JSX.Element;
    warning: react.JSX.Element;
    error: react.JSX.Element;
    success: react.JSX.Element;
    layers: react.JSX.Element;
    play: react.JSX.Element;
    pause: react.JSX.Element;
    next: react.JSX.Element;
    prev: react.JSX.Element;
    volumeHigh: react.JSX.Element;
    volumeMute: react.JSX.Element;
    plus: react.JSX.Element;
    add: react.JSX.Element;
    chevronUp: react.JSX.Element;
    chevronBottom: react.JSX.Element;
    chevronRight: react.JSX.Element;
    chevronLeft: react.JSX.Element;
    chevronRightOutline: react.JSX.Element;
    chevronLeftOutline: react.JSX.Element;
    chevronUpOutline: react.JSX.Element;
    chevronDownOutline: react.JSX.Element;
    bezier: react.JSX.Element;
    mouse: react.JSX.Element;
    addKey: react.JSX.Element;
    calendar: react.JSX.Element;
    clock: react.JSX.Element;
    done: react.JSX.Element;
    doneAll: react.JSX.Element;
    pending: react.JSX.Element;
};

type FabProps = Omit<ButtonProps, `icon`> & {
    icon?: string | keyof typeof SVGIcons;
    position?: ValueOf<typeof Position>;
};

/**
 * Fab component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Fab icon="plus" onClick={() => console.log("clicked")} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Fab icon="plus" onClick={() => console.log("clicked")} variant="primary" size="lg" />
 * ```
 * @param icon - Icon identifier
 * @param onClick - Callback function triggered on click
 * @param variant - Visual variant or style
 * @param size - Component size
 */
declare const Fab: react.ForwardRefExoticComponent<Omit<FabProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

type FieldsetProps = BoxProps & {
    legend?: string | ReactNode;
    legendPlacement?: Placement;
    variant?: ValueOf<typeof Variant>;
};

declare const Fieldset: ({ ref, children, ...props }: FieldsetProps & {
    ref?: Ref<HTMLDivElement>;
}) => react.JSX.Element;

type FilterProps = {
    names?: ValueOf<typeof FILTER>[];
    strength?: number;
};
/**
 * Filters component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Filters filters={[{ label: "Category", values: ["All", "New", "Sale"] }]} onApply={(selected) => console.log(selected)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Filters filters={[{ label: "Price", type: "range", min: 0, max: 1000 }, { label: "Brand", values: ["Nike", "Adidas"] }]} onApply={(selected) => {}} />
 * ```
 * @param filters - filters prop
 * @param onApply - Callback function triggered on filter apply
 */
declare const Filters: {
    (props: FilterProps): react.JSX.Element;
    displayName: string;
};

type FlexProps = BoxProps & {
    /** Shortcut for flex-direction: column */
    cols?: boolean;
    /** Shortcut for gap */
    gap?: number | string;
    /** Shortcut for align-self: flex-start */
    ass?: boolean;
    /** Shortcut for align-self: center */
    asc?: boolean;
    /** Shortcut for align-self: flex-end */
    ase?: boolean;
    /** Shortcut for align-items: center */
    ais?: boolean;
    /** Shortcut for align-items: flex-start */
    aic?: boolean;
    /** Shortcut for align-items: flex-end */
    aie?: boolean;
    /** Shortcut for align-items: baseline */
    aib?: boolean;
    /** Shortcut for justify-content: center */
    jcc?: boolean;
    /** Shortcut for justify-content: end */
    jce?: boolean;
    /** Shortcut for justify-content: start */
    jcs?: boolean;
    /** Shortcut for justify-content: space-between */
    jcb?: boolean;
    /** Shortcut for flex-wrap: wrap */
    wrap?: boolean;
};

/**
 * Flex component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Flex gap="md" align="center">Item 1 | Item 2 | Item 3</Flex>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Flex gap="lg" align="center" justify="space-between" direction="row" wrap={true}>Flexible layout</Flex>
 * ```
 * @param gap - Spacing between items
 * @param align - Alignment direction
 * @param justify - Justification direction
 * @param direction - direction prop
 * @param wrap - wrap prop
 */
declare const Flex: FC<FlexProps>;

/**
 * Form component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Form onSubmit={(data) => console.log(data)}><input /></Form>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Form onSubmit={(data) => console.log(data)} validation={{ email: "required" }} onError={() => {}}><input placeholder="Email" /></Form>
 * ```
 * @param onSubmit - Callback function triggered on form submission
 * @param validation - validation prop
 * @param onError - Callback function triggered on error
 */
declare const Form: {
    (props: FormProps & {
        ref?: Ref<FormHandler>;
    }): react.JSX.Element;
    displayName: string;
};

interface FormStore {
    values: dynamic;
    errors: dynamic;
    touched: Record<string, boolean>;
    isDirty: boolean;
}
declare const useForm: () => {
    values?: dynamic | undefined;
    errors?: dynamic | undefined;
    touched?: Record<string, boolean> | undefined;
    isDirty?: boolean | undefined;
    subscribe?: ((cb: () => void) => () => void) | undefined;
    getSnapshot?: (() => FormStore) | undefined;
    setFieldValue?: ((name: string, value: any) => void) | undefined;
    deleteFieldValue?: ((name: string) => void) | undefined;
    setFieldError?: ((name: string, error: string | null) => void) | undefined;
    setFieldErrors?: ((updates: Record<string, string | null>) => void) | undefined;
    reset?: (() => void) | undefined;
};

type ScrollViewDirection = 'both' | 'vertical' | 'horizontal';
type ScrollViewProps = BoxProps & {
    style?: CSSProperties;
    speed?: number;
    smooth?: boolean;
    breakpoints?: ScrollBreakpoint;
    direction?: ScrollViewDirection;
    onScroll?: (event: UIEvent<HTMLDivElement>) => void;
    /**
     * Auto-scroll to bottom when content changes.
     * Set to 'smooth' for smooth scrolling, or true for instant scrolling.
     * @default false
     */
    autoScrollToBottom?: boolean | 'smooth';
};

type GridBreakpoints = {
    ph?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
};
interface GridProps extends Omit<BoxProps, 'cols'> {
    /** Grid column template (legacy shorthand). Prefer `columns` for readability. Can be a number, string, or breakpoint object. */
    cols?: string | number | GridBreakpoints;
    /** Grid column template. Number values map to `repeat(n, 1fr)`. Can be a number, string, or breakpoint object. */
    columns?: string | number | GridBreakpoints;
    /** Grid row template. Number values map to `repeat(n, 1fr)`. Can be a number, string, or breakpoint object. */
    rows?: string | number | GridBreakpoints;
    /** CSS `gap`. */
    gap?: string | number;
    /** CSS `column-gap` (legacy shorthand). Prefer `columnGap`. */
    gapX?: string | number;
    /** CSS `row-gap` (legacy shorthand). Prefer `rowGap`. */
    gapY?: string | number;
    /** CSS `column-gap`. */
    columnGap?: string | number;
    /** CSS `row-gap`. */
    rowGap?: string | number;
    /** CSS `align-items` (legacy shorthand). Prefer `alignItems`. */
    align?: "start" | "end" | "center" | "stretch";
    /** CSS `align-items`. */
    alignItems?: "start" | "end" | "center" | "stretch";
    /** CSS `justify-content` (legacy shorthand). Prefer `justifyContent`. */
    justify?: "start" | "end" | "center" | "stretch" | "between" | "around";
    /** CSS `justify-content`. */
    justifyContent?: "start" | "end" | "center" | "stretch" | "between" | "around";
    /** Use `inline-grid` instead of `grid`. */
    inline?: boolean;
    /** CSS `grid-auto-flow` (legacy shorthand). Prefer `autoFlow`. */
    flow?: "row" | "column" | "dense" | "row dense" | "column dense";
    /** CSS `grid-auto-flow`. */
    autoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
    /** CSS `grid-auto-columns` (legacy shorthand). Prefer `autoColumns`. */
    autoCols?: string;
    /** CSS `grid-auto-columns`. */
    autoColumns?: string;
    /** CSS `grid-auto-rows` (legacy shorthand). Prefer `autoRow`. */
    autoRows?: string;
    /** CSS `grid-auto-rows`. */
    autoRow?: string;
    /** CSS `grid-template-areas` (legacy shorthand). Prefer `areas`. */
    template?: string;
    /** CSS `grid-template-areas`. */
    areas?: string;
    /** Wrap grid content with ScrollView internally. */
    scrollView?: boolean;
    /** Optional props passed to internal ScrollView wrapper. */
    scrollViewProps?: Omit<ScrollViewProps, 'children'>;
    /** Enable built-in virtualized rendering. */
    virtualize?: boolean;
    /** Total item count for virtualized grid. */
    virtualCount?: number;
    /** Fixed row height (px) for virtualization. */
    virtualRowHeight?: number;
    /** Viewport height (px) when virtualized. */
    virtualViewportHeight?: number;
    /** Overscan rows above and below viewport. */
    virtualOverscanRows?: number;
    /** Minimum item width (px) for auto column calculation. */
    virtualItemMinWidth?: number;
    /** Virtual item render callback. */
    virtualRenderItem?: (index: number) => React.ReactNode;
}

declare const Grid: {
    (props: GridProps): react.JSX.Element;
    displayName: string;
};

type GroupProps = BoxProps & {
    when?: boolean;
    fxDelay?: number;
    fxStep?: number;
    classToIgnore?: string;
};
/**
 * Group component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Group>Group content</Group>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Group spacing="md" variant="card" direction="vertical">Grouped elements</Group>
 * ```
 * @param spacing - spacing prop
 * @param variant - Visual variant or style
 * @param direction - direction prop
 */
declare const Group: react.ForwardRefExoticComponent<Omit<GroupProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type IconProps = Omit<BoxProps, `name`> & {
    ref?: Ref<HTMLDivElement>;
    name: string | ReactNode;
    pathCount?: number;
    variant?: ValueOf<typeof Variant>;
    prefix?: string;
    animated?: boolean;
    color?: string;
    size?: number;
};

/**
 * Icon component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Icon name="star" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Icon name="star" variant="lg" color="gold" />
 * ```
 * @param name - name prop
 * @param variant - Visual variant or style
 * @param color - color prop
 */
declare const Icon: react.ForwardRefExoticComponent<Omit<IconProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type ImageProps = Props<`img`> & {
    /** Scroll physics configuration for applying transform effects based on scroll position */
    scrollPhysics?: ScrollPhysicsOptions;
    /** Reference to a custom scroll container (e.g., ScrollView) */
    scrollContainer?: Ref<HTMLElement>;
};
/**
 * Image component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Image src="https://example.com/image.jpg" alt="Description" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Image src="https://example.com/image.jpg" alt="Product" width="300px" height="auto" objectFit="cover" />
 * ```
 *
 * @example
 * // With scroll physics for parallax effect
 * ```tsx
 * <Image
 *   src="https://example.com/image.jpg"
 *   alt="Parallax"
 *   scrollPhysics={{ y: 1, yMultiplier: 0.3 }}
 * />
 * ```
 * @param src - Source URL
 * @param alt - Alt text
 * @param width - width prop
 * @param height - height prop
 * @param objectFit - objectFit prop
 * @param scrollPhysics - Scroll physics configuration
 * @param scrollContainer - Custom scroll container reference
 */
declare const Image: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof ZuzProps> & {
    /** Scroll physics configuration for applying transform effects based on scroll position */
    scrollPhysics?: ScrollPhysicsOptions;
    /** Reference to a custom scroll container (e.g., ScrollView) */
    scrollContainer?: Ref<HTMLElement>;
} & react.RefAttributes<HTMLImageElement>>;

/**
 * Input component with advanced masking and pattern validation.
 *
 * @description
 * A text input field that integrates with Form context for validation and supports
 * advanced input masking with pattern-based character validation. Mask edits (typing,
 * pasting, cutting, deleting forward/backward, replacing a selection) are handled via
 * the `beforeinput` event so they work correctly from any cursor position, not just
 * when appending at the end.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Input placeholder="Enter text..." onChange={(e) => console.log(e.target.value)} />
 * ```
 *
 * @example
 * // Phone number with numeric validation
 * ```tsx
 * <Input
 *   mask={{ mask: '(000) 000-0000' }}
 * />
 * ```
 *
 * @example
 * // Custom placeholder character shown on focus (default '_')
 * ```tsx
 * <Input
 *   mask={{ mask: '00000-0000000-0', placeholderChar: '•' }}
 * />
 * ```
 *
 * @param {string} [name] - Field name for form data
 * @param {boolean} [numeric] - Restricts input to numbers only
 * @param {Variant} [variant] - Size variant (xs, sm, md, lg, xl)
 * @param {WithFormValidation} [with] - Validation rules object
 * @param {(value: string) => void} [onConfirm] - Callback fired on Enter/Return
 * @param {InputMaskOptions} [mask] - Mask configuration for pattern-based input
 *
 * @see InputMaskOptions for mask pattern syntax:
 * - Pattern character `0` = numeric (0-9)
 * - Pattern character `A` = alphabetic (a-z, A-Z)
 * - Pattern character `Z` = alphanumeric (a-z, A-Z, 0-9)
 * - Pattern character `S` = any character (no validation)
 * - Any other character = fixed separator (shown as literal, auto-inserted as you type)
 */
declare const Input: {
    ({ ref, ...props }: InputProps): react.JSX.Element;
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

/**
 * KeyboardKeys component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <KeyboardKeys keys={["Ctrl", "K"]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <KeyboardKeys keys={["Cmd", "Shift", "P"]} size="sm" variant="dark" />
 * ```
 * @param keys - keys prop
 * @param size - Component size
 * @param variant - Visual variant or style
 */
declare const KeyBoardKeys: react.ForwardRefExoticComponent<Omit<KeyboardKeyProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

type LabelProps = Props<`label`> & {};
/**
 * Label component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Label>Username</Label>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Label required={true} error="Username is required">Username</Label>
 * ```
 * @param required - required prop
 * @param error - error prop
 */
declare const Label: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "ref">, keyof ZuzProps> & react.RefAttributes<HTMLLabelElement>>;

declare enum ToastType {
    Default = "default",
    Success = "success",
    Error = "error",
    Warn = "warn",
    Promise = "promise"
}
declare enum ToastPosition {
    TopLeft = "TopLeft",
    TopCenter = "TopCenter",
    TopRight = "TopRight",
    BottomLeft = "BottomLeft",
    BottomCenter = "BottomCenter",
    BottomRight = "BottomRight"
}
declare enum ToastStyle {
    Stack = "stack",
    Individual = "individual"
}
interface ToastAction {
    label: string;
    tag?: string;
    buttonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
    onClick: (e: any) => void;
    variant?: 'primary' | 'secondary';
}
declare const ToastDefaultTitle: dynamic;
interface ToastProps {
    id?: number;
    type: ToastType;
    icon?: string;
    busy?: boolean;
    title?: string | ReactNode;
    message?: string | ReactNode;
    duration?: number;
    sticky?: boolean;
    position?: ToastPosition;
    style?: ToastStyle;
    actions?: ToastAction[];
    variant?: ValueOf<typeof Variant>;
    inBackground?: boolean;
    progress?: boolean;
    progressValue?: number;
    width?: number | string;
    onClose?: (id: number) => void;
    onClick?: (e: any) => void;
}

type LayerType = "dialog" | "drawer" | "toast" | "menu" | "colorpicker";

/**
 * Layers component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Layers>Content with layering</Layers>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Layers zIndex={10} opacity={0.9}>Stacked content</Layers>
 * ```
 * @param zIndex - Z-index stacking order
 * @param opacity - Opacity level (0-1)
 */
declare const LayersProvider: FC<{
    children: ReactNode;
}>;

type LightboxProps = BoxProps & {
    images: string[];
    startIndex?: number;
    isOpen?: boolean;
    onClose?: () => void;
    renderItem?: (src: string, index: number, activeIndex: number) => ReactNode;
};

declare const Lightbox: ({ images, startIndex, isOpen, onClose, renderItem, ...pops }: LightboxProps) => react.JSX.Element | null;

type ListItemObject = {
    icon?: ReactNode;
    label?: ReactNode;
    action?: ReactNode;
    className?: string;
    animate?: animationProps;
    onClick?: (event: any) => void;
};
type ListItemMeta = Props<`li`> & ListItemObject;
type ListItem = ReactNode | ListItemMeta;
type ListRenderContext = {
    index: number;
    isDragging: boolean;
    isOver: boolean;
    canReceive: boolean;
    highlighted: boolean;
    /** True when this item is the active keyboard-navigation selection */
    selected: boolean;
};
type ListRender<T = ListItem> = (item: T, context: ListRenderContext) => ReactNode;
/** Imperative handle exposed via `ref` for programmatic selection control */
type ListHandler = {
    /** Move the selection to the previous (lower-index) item, clamped to 0 */
    setPrev: () => void;
    /** Move the selection to the next (higher-index) item, clamped to the last index */
    setNext: () => void;
    /** Index of the currently selected item, or null when nothing is selected */
    getSelected: () => number | null;
    /** The underlying <ul>/<ol> DOM element */
    readonly element: HTMLUListElement | HTMLOListElement | null;
};
type VirtualScrollOptions = {
    /** Height of each item in pixels */
    itemHeight?: number;
    /** Container height in pixels (auto-detected if not provided) */
    height?: number;
    /** Number of items to render outside visible area */
    overscan?: number;
};
type ListProps = Omit<Props<`ul` | `ol`>, "onSelect"> & {
    /** Visual variant (size) */
    variant?: ValueOf<typeof Variant>;
    /** Array of items to render (ReactNode or ListItemMeta) */
    items: ListItem[];
    /** Layout direction: "cols" (default) or "rows" */
    direction?: "cols" | "rows";
    /** Separator element between items */
    seperator?: ReactNode;
    /** Render as <ol> instead of <ul> */
    ol?: boolean;
    /** Enable sortable drag-and-drop reordering within the list */
    sortable?: boolean;
    /** Allow individual items to be dragged */
    itemDraggable?: boolean;
    /** Allow individual items to be drop targets */
    itemDroppable?: boolean;
    /** DnD channel (default: "__zuz_ui_list_item__"). For cross-list dragging, use the same channel on all lists */
    dragChannel?: DragType;
    /** Delay before drag starts in milliseconds (0 = instant) */
    dragDelay?: number;
    /** Visual mode while dragging: "self" (placeholder in-list + floating ghost) or "clone" (faded original + floating ghost) */
    ghostMode?: "self" | "clone";
    /** Duration of drop highlight animation in ms */
    dropHighlightDuration?: number;
    /** Drop highlight animation type (ScaleIn, SlideIn*, FadeIn) */
    dropHighlightTransition?: ValueOf<typeof TRANSITIONS>;
    /** Drop highlight animation curve (Spring, Ease, Linear, etc.) */
    dropHighlightCurve?: ValueOf<typeof TRANSITION_CURVES>;
    /** Custom render function for list items (signature: (item, context) => ReactNode) */
    render?: ListRender<any>;
    /** Content to display when list is empty (string, ReactNode, or custom message) */
    empty?: ReactNode;
    /** Callback when items are reordered. For cross-list moves, handle items leaving/entering other lists here */
    onSort?: (items: ListItem[], context: {
        from: number;
        to: number;
        item: ListItem;
    }) => void;
    /** Virtual scrolling config for large lists */
    virtual?: VirtualScrollOptions;
    /** CSS list-style property */
    listStyle?: CSSProperties[`listStyle`] | string;
    hoverable?: boolean;
    /** Enable arrow-key (up/down) navigation to move a selection across items */
    keyboardNavigation?: boolean;
    /** Index selected by default when keyboardNavigation is enabled (defaults to 0) */
    defaultSelected?: number;
    /** Fired when Enter is pressed on the keyboard-selected item (signature: (item, index) => void). Note: overrides the native DOM onSelect handler */
    onSelect?: (item: ListItem, index: number) => void;
    /** Fired when any item is clicked (signature: (item, index, event) => void). Works with both object-meta items and custom `render`. The per-item `onClick` in item meta still runs first. */
    onItemClick?: (item: ListItem, index: number, event: any) => void;
};

/**
 * List component with drag-and-drop sorting and virtual scrolling support.
 *
 * Features:
 * - Sortable items with visual feedback (ghost modes: "self" or "clone")
 * - Custom render callbacks for full control over item appearance
 * - Cross-list dragging support (share dragChannel across multiple lists)
 * - Animated drop highlights with configurable transitions
 * - Virtual scrolling for large lists
 *
 * @example
 * // Basic sortable list
 * ```tsx
 * <List
 *   items={[{ label: "Item 1" }, { label: "Item 2" }]}
 *   sortable
 *   onSort={(items, { from, to }) => updateItems(items)}
 * />
 * ```
 *
 * @example
 * // Custom render with drag context
 * ```tsx
 * <List
 *   items={tasks}
 *   sortable
 *   ghostMode="self"
 *   render={(task, { isDragging, isOver, highlighted }) => (
 *     <Box className={isDragging ? "opacity:.6" : ""}>
 *       {task.title}
 *     </Box>
 *   )}
 *   onSort={(items) => setTasks(items)}
 * />
 * ```
 *
 * @example
 * // Cross-list dragging (share dragChannel)
 * ```tsx
 * const SHARED_CHANNEL = "KANBAN_CARD";
 *
 * <List
 *   items={todoList}
 *   sortable
 *   dragChannel={SHARED_CHANNEL}
 *   onSort={(items, { from, to, item }) => {
 *     // Handle reordering and cross-list moves
 *     setTodoList(items);
 *   }}
 * />
 * <List
 *   items={doneList}
 *   sortable
 *   dragChannel={SHARED_CHANNEL}
 *   onSort={(items) => setDoneList(items)}
 * />
 * ```
 */
declare const List: react.ForwardRefExoticComponent<Omit<Props<"ol" | "ul">, "onSelect"> & {
    variant?: ValueOf<typeof Variant>;
    items: ListItem[];
    direction?: "cols" | "rows";
    seperator?: react.ReactNode;
    ol?: boolean;
    sortable?: boolean;
    itemDraggable?: boolean;
    itemDroppable?: boolean;
    dragChannel?: _zuzjs_hooks.DragType;
    dragDelay?: number;
    ghostMode?: "self" | "clone";
    dropHighlightDuration?: number;
    dropHighlightTransition?: ValueOf<typeof TRANSITIONS>;
    dropHighlightCurve?: ValueOf<typeof TRANSITION_CURVES>;
    render?: ListRender<any>;
    empty?: react.ReactNode;
    onSort?: (items: ListItem[], context: {
        from: number;
        to: number;
        item: ListItem;
    }) => void;
    virtual?: VirtualScrollOptions;
    listStyle?: CSSProperties[`listStyle`] | string;
    hoverable?: boolean;
    keyboardNavigation?: boolean;
    defaultSelected?: number;
    onSelect?: (item: ListItem, index: number) => void;
    onItemClick?: (item: ListItem, index: number, event: any) => void;
} & react.RefAttributes<ListHandler>>;

/**
 * A pointer-reactive grid where each cell responds to cursor proximity
 * with scale, rotation, translation, and color shifts. */
type MagneticGridProps = Omit<BoxProps, "cols" | "rows" | "gap" | "background" | "color"> & {
    rows?: number;
    cols?: number;
    cellSize?: number;
    gap?: number;
    radius?: number;
    maxScale?: number;
    maxRotate?: number;
    maxLift?: number;
    falloff?: "linear" | "exponential" | "smooth";
    mode?: "dots" | "squares" | "bars" | "ascii";
    color?: string;
    accentColor?: string;
    background?: string;
    magnetic?: boolean;
};
declare const MagneticGrid: (props: MagneticGridProps) => react__default.JSX.Element;

interface MediaPlayerController {
}
type MediaPlayerProps = Omit<BoxProps, `ref`> & {
    ref?: Ref<MediaPlayerController>;
    playlist?: MediaItem[];
    mode?: 'audio' | 'video';
    autoPlay?: boolean;
    icons?: MediaPlayerIcons;
    defaultTitle?: string;
    defaultCover?: string;
    defaultArtist?: string;
    onTrackChange?: (item: MediaItem) => void;
};
type MediaPlayerIcon = string | ReactNode;
interface MediaPlayerIcons {
    play?: MediaPlayerIcon;
    pause?: MediaPlayerIcon;
    prev?: MediaPlayerIcon;
    next?: MediaPlayerIcon;
    volumeHigh?: MediaPlayerIcon;
    volumeMute?: MediaPlayerIcon;
    loading?: MediaPlayerIcon;
}
type MediaPlayerContextType = ReturnType<typeof useMediaPlayer> & {
    icons?: MediaPlayerIcons;
    mode?: "audio" | "video";
    defaultTitle?: string;
    defaultCover?: string;
    defaultArtist?: string;
};

/**
 * MediaPlayer component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <MediaPlayer src="https://example.com/video.mp4" type="video" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <MediaPlayer src="https://example.com/video.mp4" type="video" controls autoplay={false} width="100%" />
 * ```
 * @param src - Source URL
 * @param type - Component or input type
 * @param controls - controls prop
 * @param autoplay - Whether carousel autoplays
 * @param width - width prop
 */
declare const MediaPlayer: (({ ref, icons: customIcons, children, ...props }: MediaPlayerProps) => react.JSX.Element) & {
    Stage: () => react.JSX.Element;
    TrackInfo: () => react.JSX.Element;
    Controls: () => react.JSX.Element;
    Progress: () => react.JSX.Element;
    Volume: () => react.JSX.Element;
};

type NetworkManagerprops = BoxProps & {
    variant?: ValueOf<typeof Variant>;
    offlineMessage?: string;
    onlineMessage?: string;
};

/**
 * Network component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Network nodes={[{ id: "1", label: "Node 1" }]} links={[]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Network nodes={[{ id: "1", label: "A" }, { id: "2", label: "B" }]} links={[{ source: "1", target: "2" }]} />
 * ```
 * @param nodes - Tree node definitions
 * @param links - Links between nodes
 */
declare const NetworkManager: react.ForwardRefExoticComponent<Omit<NetworkManagerprops, "ref"> & react.RefAttributes<HTMLDivElement>>;

type OverlayProps = BoxProps & {
    when?: boolean;
};
/**
 * Overlay component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Overlay onClick={() => console.log("clicked")} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Overlay visible={true} zIndex={100} opacity={0.5} onClick={() => {}} />
 * ```
 * @param visible - Whether element is visible
 * @param zIndex - Z-index stacking order
 * @param opacity - Opacity level (0-1)
 * @param onClick - Callback function triggered on click
 */
declare const Overlay: react.ForwardRefExoticComponent<Omit<OverlayProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare enum PaginationStyle {
    Table = "table",
    Gooey = "gooey"
}
interface PaginationController {
    setPage: (index: PaginationPage) => void;
    getPage: (index: number) => void;
    setProgress: (index: number) => void;
    getProgress: () => number;
}
type PaginationPageItem = {
    id: string | number;
    label: string | number;
};
type PaginationPage = number | PaginationPageItem;
type PaginationCallback = (page: PaginationPageItem) => void;
type PaginationProps = Omit<BoxProps, "ref"> & {
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
    asDots?: boolean;
    progressBar?: boolean;
    renderOnZeroPageCount?: boolean;
    onPageChange?: PaginationCallback;
};

/**
 * Pagination component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Pagination total={100} pageSize={10} onChange={(page) => console.log(page)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Pagination total={250} pageSize={50} defaultPage={1} onChange={(page) => console.log(page)} />
 * ```
 * @param total - total prop
 * @param pageSize - pageSize prop
 * @param onChange - Callback function triggered when value changes
 * @param defaultPage - defaultPage prop
 */
declare const Pagination: {
    ({ ref, ...props }: PaginationProps & {
        ref?: Ref<PaginationController>;
    }): react.JSX.Element | null;
    displayName: string;
};

type PasswordProps = Omit<InputProps, `type` | `numeric`> & {
    strenthMeter?: boolean;
};
/**
 * Password component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Password onChange={(pass) => console.log(pass)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Password onChange={(pass) => console.log(pass)} strength={true} showStrength variant="primary" />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param strength - strength prop
 * @param showStrength - showStrength prop
 * @param variant - Visual variant or style
 */
declare const Password: react.ForwardRefExoticComponent<Omit<PasswordProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type PhoneInputValue = {
    rawInput: string;
    countryCode: CountryCode;
    isValid: boolean;
    metaFormat: string;
};
type PhoneInputProps = Omit<InputProps, 'type' | 'onChange' | 'value'> & {
    value?: {
        countryCode: CountryCode;
        rawInput: string;
    };
    hideCountryName?: boolean;
    onChange?: (value: PhoneInputValue) => void;
};

declare const PhoneInput: ({ ref, value, variant, as, hideCountryName, placeholder, onChange, ...props }: PhoneInputProps) => react__default.JSX.Element;

type PinInputProps = InputProps & {
    mask?: boolean;
    size?: number;
    length?: number;
};
/**
 * PinInput component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <PinInput length={4} onChange={(pin) => console.log(pin)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <PinInput length={6} onChange={(pin) => console.log(pin)} type="numeric" variant="primary" />
 * ```
 * @param length - Length of PIN/key sequence
 * @param onChange - Callback function triggered when value changes
 * @param type - Component or input type
 * @param variant - Visual variant or style
 */
declare const PinInput: react.ForwardRefExoticComponent<Omit<PinInputProps, "ref"> & react.RefAttributes<HTMLInputElement>>;

type ProgressBarProps = BoxProps & {
    progress?: number;
    type?: ValueOf<typeof PROGRESS>;
    animated?: boolean;
};
interface ProgressHandler {
    setProgress?: (p: number) => void;
    getProgress?: () => number;
}

/**
 * ProgressBar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ProgressBar value={65} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ProgressBar value={65} max={100} variant="success" animated label="65%" />
 * ```
 * @param value - Current value
 * @param max - max prop
 * @param variant - Visual variant or style
 * @param animated - animated prop
 * @param label - Label text for the component
 */
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

/**
 * Radio component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Radio label="Option 1" value="opt1" onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Radio label="Option 1" value="opt1" defaultChecked={true} variant="primary" />
 * ```
 * @param label - Label text for the component
 * @param value - Current value
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param variant - Visual variant or style
 */
declare const Radio: react.ForwardRefExoticComponent<ZuzProps & Omit<Omit<react.DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof ZuzProps> & {
    type?: ValueOf<typeof RADIO>;
    variant?: ValueOf<typeof Variant>;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & react.RefAttributes<RadioHandler>>;

/**
 * ScrollView component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ScrollView><div>Scrollable content here</div></ScrollView>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ScrollView direction="vertical" scrollbar="auto" onScroll={(pos) => console.log(pos)}>Long content</ScrollView>
 * ```
 * @param direction - direction prop
 * @param scrollbar - scrollbar prop
 * @param onScroll - Callback function triggered on scroll
 */
declare const ScrollView: react.ForwardRefExoticComponent<Omit<ScrollViewProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

declare const useScrollView: () => RefObject<HTMLDivElement | null> | null;

type SearchProps = Omit<InputProps, `onChange` | `onSubmit`> & {
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
    clearOnSubmit?: boolean;
};
interface SearchHandler {
    focus: () => void;
    setValue: (q: string) => void;
}

/**
 * Search component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Search onChange={(query) => console.log(query)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Search onChange={(query) => console.log(query)} placeholder="Search..." debounceMs={300} onSubmit={(q) => {}} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param placeholder - Placeholder text
 * @param debounceMs - debounceMs prop
 * @param onSubmit - Callback function triggered on form submission
 */
declare const Search: react.ForwardRefExoticComponent<Omit<SearchProps, "ref"> & react.RefAttributes<SearchHandler>>;

/**
 * Segmented component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Segmented options={["Tab 1", "Tab 2"]} onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Segmented options={[{ label: "All", value: "all" }, { label: "Active", value: "active" }]} defaultValue="all" />
 * ```
 * @param options - Array of available options
 * @param onChange - Callback function triggered when value changes
 * @param defaultValue - Default value
 */
declare const Segmented: react.ForwardRefExoticComponent<Omit<SegmentProps, "ref"> & react.RefAttributes<SegmentController>>;

type SelectPrimitive = string | number;
type SelectSingleValue = Option | SelectPrimitive;
type SelectValue = SelectSingleValue | Option[] | SelectPrimitive[] | null;
type SelectSingleChange = Option;
type SelectEditableChange = Option | SelectPrimitive;
type SelectMultipleChange = Option[];
/**
 * Ref handle exposed by `Select`.
 *
 * @example
 * ```tsx
 * const selectRef = useRef<SelectHandler>(null)
 *
 * <Select ref={selectRef} options={options} label="Status" />
 *
 * selectRef.current?.setSelected("in-progress")
 * const selected = selectRef.current?.getValue()
 * ```
 */
interface SelectHandler {
    /**
     * Programmatically sets the selected value.
     *
     * Accepts option objects, primitive values, arrays, or `null`.
     * @param option - The next value to set.
     */
    setSelected: (option: SelectValue) => void;
    /**
     * Returns the current selected value.
     * @returns Current `Option`, array of `Option`, primitive value, or `null`.
     */
    getValue: () => Option | Option[] | SelectPrimitive | null;
}
/**
 * Represents a selectable option.
 *
 * @example
 * ```tsx
 * const options: Option[] = [
 *   { label: "Todo", value: "todo" },
 *   { label: "In Progress", value: "in-progress", icon: "clock" },
 *   { label: "Done", value: "done", disabled: true }
 * ]
 * ```
 */
type Option = {
    /** Optional icon to display next to the label. Can be a string (URL/Path) or a ReactNode. */
    icon?: string | ReactNode;
    /** Optional color for the icon. */
    iconColor?: string;
    /** The display text for the option. */
    label: string;
    /** Optional color for the label. */
    labelColor?: string;
    /** Optional color for the border. */
    borderColor?: string;
    /** Optional color for the background. */
    bgColor?: string;
    /** The underlying value for the option. */
    value: string | number;
    /** Optional flag to disable this specific option. */
    disabled?: boolean;
    /** Special value parameter for categorization or grouping or passing additional metadata. */
    tag?: string;
    /** Nested sub-options for hierarchical or grouped selections. */
    subOptions?: Option[];
};
/**
 * Represents an option object with a label and value.
 */
type Value = FormEventHandler<HTMLDivElement> & Option;
interface OptionItemProps {
    updateValue: (o: Option) => void;
    o: Option;
    selected?: boolean;
    checkIcon?: string | ReactNode;
    depth?: number;
    hasSubOptions?: boolean;
    expanded?: boolean;
    forceExpanded?: boolean;
    onToggleExpand?: () => void;
    renderOption?: (option: Option, meta: {
        selected: boolean;
        depth: number;
        hasSubOptions: boolean;
        expanded: boolean;
        forceExpanded: boolean;
    }) => ReactNode;
}
type SelectCommonProps = Omit<BoxProps, "onChange" | "ref"> & {
    ref?: Ref<SelectHandler>;
    /**
     * Size of the select field.
     * @default "sm"
     */
    variant?: ValueOf<typeof Variant>;
    /**
     * Size of the select field.
     * @default "sm"
     */
    searchVariant?: ValueOf<typeof Variant>;
    /**
     * Visual style for the select trigger.
     * Matches Button kind variants.
     * @default "surface"
     */
    kind?: Appearance;
    /**
     * Indicates if the select field is required and its validation type.
     */
    required?: boolean;
    /**
     * Array of options to be displayed in the select dropdown.
        *
        * @example
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
     * Enables the search functionality within the select dropdown.
     */
    search?: boolean;
    /**
     * Placeholder text for the search input field.
     */
    searchPlaceholder?: string;
    /**
     * Expand width to parent 100%
     * width:100%
     */
    expanded?: boolean;
    /**
     * Max Height
     */
    maxHeight?: number;
    arrowDownIcon?: string | ReactNode;
    arrowUpIcon?: string | ReactNode;
    disabled?: boolean;
    wrapTokens?: boolean;
    checkIcon?: string | ReactNode;
    closeIcon?: string | ReactNode;
    /** Force all sub-option branches expanded (overrides collapse state). */
    forceExpandSubOptions?: boolean;
    /** Custom option renderer for dropdown rows. */
    render?: (option: Option, meta: {
        selected: boolean;
        depth: number;
        hasSubOptions: boolean;
        expanded: boolean;
        forceExpanded: boolean;
    }) => ReactNode;
};
type SelectChangeValue<TMultiple extends boolean, TTokenizer extends boolean, TEditable extends boolean> = TMultiple extends true ? SelectMultipleChange : TTokenizer extends true ? SelectMultipleChange : TEditable extends true ? SelectEditableChange : SelectSingleChange;
type SelectSelectedValue<TMultiple extends boolean, TTokenizer extends boolean, TEditable extends boolean> = TMultiple extends true ? Option[] | SelectPrimitive[] | null : TTokenizer extends true ? Option[] | SelectPrimitive[] | null : TEditable extends true ? SelectSingleValue | null : SelectSingleValue | null;
type SelectModeProps<TMultiple extends boolean, TTokenizer extends boolean, TEditable extends boolean> = TEditable extends true ? {
    multiple?: false;
    tokenizer?: false;
    editable: true;
    editablePlaceholder?: string;
} : TMultiple extends true ? {
    /**
     * Enables multi-select behavior.
     *
     * @example
     * ```tsx
     * <Select label="Roles" options={roleOptions} multiple />
     * ```
     */
    multiple: true;
    tokenizer?: TTokenizer;
    editable?: false | undefined;
    editablePlaceholder?: never;
} : TTokenizer extends true ? {
    /**
     * Renders selected items as removable tokens.
     */
    tokenizer: true;
    multiple?: TMultiple;
    editable?: false | undefined;
    editablePlaceholder?: never;
} : {
    multiple?: false;
    tokenizer?: false;
    editable?: false | undefined;
    editablePlaceholder?: never;
};
type SelectProps<TMultiple extends boolean = false, TTokenizer extends boolean = false, TEditable extends boolean = false> = SelectCommonProps & SelectModeProps<TMultiple, TTokenizer, TEditable> & {
    /**
     * The currently selected option.
     */
    selected?: SelectSelectedValue<TMultiple, TTokenizer, TEditable>;
    /**
     * Callback function triggered when the selected option changes.
     */
    onChange?: (v: SelectChangeValue<TMultiple, TTokenizer, TEditable>) => void;
};
type SelectSingleProps = SelectProps<false, false, false>;
type SelectEditableProps = SelectProps<false, false, true>;
type SelectMultipleProps = SelectProps<true, boolean, false>;
type SelectTokenizerProps = SelectProps<boolean, true, false>;
type SelectInternalProps = SelectCommonProps & {
    /**
     * The currently selected option.
     */
    selected?: SelectSingleValue | Option[] | SelectPrimitive[] | null;
    /**
     * Callback function triggered when the selected option changes.
     * @param v - The newly selected option.
        *
        * @example
        * ```tsx
        * onChange={(v) => {
        *   if (Array.isArray(v)) {
        *     console.log("Multi value", v.map(item => item.value))
        *   } else {
        *     console.log("Single value", v)
        *   }
        * }}
        * ```
     */
    onChange?: (v: Option | Option[] | SelectPrimitive) => void;
    /**
     * Enables multi-select behavior.
     *
     * @example
     * ```tsx
     * <Select label="Roles" options={roleOptions} multiple />
     * ```
     */
    multiple?: boolean;
    /**
     * Renders selected items as removable tokens.
     */
    tokenizer?: boolean;
    /**
     * Allows entering custom values when not in `multiple` or `tokenizer` mode.
     */
    editable?: boolean;
    editablePlaceholder?: string;
};

type SelectComponent = {
    (props: SelectSingleProps & {
        ref?: Ref<SelectHandler>;
    }): ReactElement;
    (props: SelectEditableProps & {
        ref?: Ref<SelectHandler>;
    }): ReactElement;
    (props: SelectMultipleProps & {
        ref?: Ref<SelectHandler>;
    }): ReactElement;
    (props: SelectTokenizerProps & {
        ref?: Ref<SelectHandler>;
    }): ReactElement;
    displayName?: string;
};
/**
 * Select component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Select options={[{ label: "Option 1", value: "1" }]} onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Select options={[{ label: "Red", value: "red" }, { label: "Blue", value: "blue" }]} multiple searchable onSelect={(item) => {}} />
 * ```
 * @param options - Array of available options
 * @param onChange - Callback function triggered when value changes
 * @param multiple - multiple prop
 * @param searchable - searchable prop
 * @param onSelect - Callback function triggered on selection
 */
declare const Select: SelectComponent;

interface SliderController {
}
type SliderProps = Omit<BoxProps, `ref`> & {
    ref?: Ref<SliderController>;
    type?: ValueOf<typeof SLIDER>;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    roundValue?: boolean;
    showKnobOnHover?: boolean;
    showGhostBar?: boolean;
    showToolTip?: boolean;
    formatValue?: (value: number) => string | number;
    onChange?: (value: number) => void;
};

/**
 * Slider component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Slider value={50} onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Slider value={50} min={0} max={100} step={5} onChange={(val) => console.log(val)} />
 * ```
 * @param value - Current value
 * @param min - min prop
 * @param max - max prop
 * @param step - step prop
 * @param onChange - Callback function triggered when value changes
 */
declare const Slider: {
    ({ ref, ...props }: SliderProps): react.JSX.Element;
    displayName: string;
};

interface Step {
    /** Step number (auto-generated if not provided) */
    index?: number;
    /** Icon to display instead of step number */
    icon?: ReactNode;
    /** Label text for the step */
    label?: ReactNode;
    /** Description text below the label */
    description?: ReactNode;
    /** Whether this step is completed */
    completed?: boolean;
    /** Whether this step has an error */
    error?: boolean;
    /** Whether this step is disabled */
    disabled?: boolean;
}
type StepsProps = BoxProps & {
    /** Array of steps to display */
    steps: Step[];
    /** Current active step index (0-based) */
    current?: number;
    /** Visual variant */
    variant?: ValueOf<typeof Variant>;
    /** Direction of steps */
    direction?: 'horizontal' | 'vertical';
    /** Show step numbers */
    showNumber?: boolean;
    /** Allow clicking on steps to navigate */
    clickable?: boolean;
    /** Callback when a step is clicked */
    onChange?: (index: number, step: Step) => void;
};

declare const Steps: ({ ref, ...props }: StepsProps) => react.JSX.Element;

type SpanProps = Props<`span`> & {
    ref?: Ref<HTMLSpanElement>;
};

/**
 * Span component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Span>Text span</Span>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Span variant="muted" size="sm">Secondary text</Span>
 * ```
 * @param variant - Visual variant or style
 * @param size - Component size
 */
declare const Span: {
    ({ ref, ...props }: SpanProps): react.JSX.Element;
    displayName: string;
};

/**
 * Spinner component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Spinner />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Spinner type="dots" variant="primary" size="lg" />
 * ```
 * @param type - Component or input type
 * @param variant - Visual variant or style
 * @param size - Component size
 */
declare const Spinner: {
    (props: SpinnerProps): react.JSX.Element;
    displayName: string;
};

type StackProps = BoxProps & {
    children: ReactNode;
    width?: number | string;
    height?: number | string;
    /**
     * Automatically changes layout direction to horizontal row.
     * Defaults to vertical column.
     */
    horizontal?: boolean;
    /**
     * Space between stack items.
     */
    gap?: number | string;
    /**
     * When true, transforms the stack into a Stacked Card Deck.
     */
    deck?: boolean;
    /**
     * Optional: Controls the rotational spread multiplier of the deck fan. Defaults to 4.
     */
    deckOffset?: number;
    deckOffsetX?: number;
    deckOffsetY?: number;
    deckDirection?: "left" | "right";
    deckBlastRadius?: number;
};

declare const Stack: ({ ref, ...props }: StackProps) => react__default.JSX.Element;

/**
 * Switch component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Switch onChange={(checked) => console.log(checked)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Switch defaultChecked={true} disabled={false} variant="primary" onChange={(checked) => console.log(checked)} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param disabled - Whether component is disabled
 * @param variant - Visual variant or style
 */
declare const Switch: {
    ({ ref, ...props }: CheckBoxProps & {
        ref?: Ref<CheckboxHandler>;
    }): react.JSX.Element;
    displayName: string;
};

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

/**
 * Table component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Table schema={[{ id: "name", value: "Name" }]} rows={[{ name: "Jane Doe" }]} rowsPerPage={10} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Table schema={[{ id: "id", value: "ID" }, { id: "name", value: "Name" }]} rows={[{ id: 1, name: "Jane" }]} sortable filterable rowsPerPage={20} />
 * ```
 */
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

/**
 * TableOfContents component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TableOfContents items={[{ id: "intro", label: "Introduction" }, { id: "guide", label: "Guide" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TableOfContents items={[{ id: "intro", label: "Intro" }, { id: "api", label: "API" }]} onSelect={(id) => console.log(id)} />
 * ```
 * @param items - Array of items
 * @param onSelect - Callback function triggered on selection
 */
declare const TableOfContents: ({ ref, ...props }: TableOfContentsProps) => react.JSX.Element;

interface TabBodyProps {
    isActive: boolean;
    transitionType?: "slide" | "fade" | "scale";
    speed: number;
    width: number;
    render: boolean;
    index: number;
    onHeightChange?: (index: number, height: number) => void;
    content: string | ReactNode | ReactNode[];
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
type TabViewProps = Omit<BoxProps, "onChange" | "height"> & {
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
     * Controls the tab body height.
     * `fit-content` measures and animates to the active tab body's height.
     * `max-content` grows to the tallest rendered tab body.
     */
    height?: "fit-content" | "max-content";
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
    /**
     * Default active tab index.
     * @default 0
     * @example defaultActive: 1
     */
    defaultActive?: number;
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
declare const TabView: {
    ({ ref, ...props }: TabViewProps & {
        ref?: Ref<TabViewHandler>;
    }): react.JSX.Element;
    displayName: string;
};

interface TerminalHandler {
    write: (line: TerminalLine | string) => void;
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

/**
 * Terminal component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Terminal welcomeMessage="Welcome" commands={{ help: "Shows all commands" }} onCommand={(cmd) => console.log(cmd)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Terminal welcomeMessage="CLI v1.0" commands={{ list: "List items", run: "Execute task" }} onCommand={(cmd) => `Executed: ${cmd}`} prompt="$" />
 * ```
 * @param welcomeMessage - welcomeMessage prop
 * @param commands - commands prop
 * @param onCommand - Callback function triggered on command execution
 * @param prompt - prompt prop
 */
declare const Terminal: ({ ref, commands, onCommand, welcomeMessage, prompt, variant, ...props }: TerminalProps & {
    ref?: Ref<TerminalHandler>;
}) => react.JSX.Element;

type TextFxVariant = 'bounce' | 'wave' | 'slide' | 'fade' | 'glitch' | `glitch-v2` | 'typewriter' | `fog` | `pop` | `reveal` | `shuffle`;
type TextKind = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
type TextProps = Props<`h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | `span` | `div` | `label`> & {
    ref?: Ref<HTMLHeadingElement>;
    kind?: TextKind;
    html?: ReactNode | string;
    lines?: number;
    tfx?: TextFxVariant;
    /** Init delay before animation starts */
    delay?: number;
    duration?: number;
    stagger?: number;
    repeat?: boolean;
    reveal?: boolean;
    hover?: boolean;
    /** Scroll physics configuration for applying transform effects based on scroll position */
    scrollPhysics?: ScrollPhysicsOptions;
    /** Reference to a custom scroll container (e.g., ScrollView) */
    scrollContainer?: Ref<HTMLElement>;
};

/**
 * Text component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Text>Paragraph text</Text>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Text size="lg" weight="bold" align="center" color="primary">Emphasized text</Text>
 * ```
 * @param size - Component size
 * @param weight - weight prop
 * @param align - Alignment direction
 * @param color - color prop
 */
declare const Text: {
    ({ ref, scrollPhysics, scrollContainer, ...props }: TextProps): react.JSX.Element;
    displayName: string;
};

declare const P: (props: Omit<TextProps, "kind">) => react.JSX.Element;

type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean;
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`;
    maxHeight?: number | string;
    variant?: ValueOf<typeof Variant>;
    command?: string;
    commands?: Command[];
    with?: WithFormValidation;
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

/**
 * TextArea component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TextArea placeholder="Enter message..." onChange={(e) => console.log(e.target.value)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TextArea placeholder="Description..." rows={5} maxLength={500} onChange={(e) => console.log(e.target.value)} />
 * ```
 * @param placeholder - Placeholder text
 * @param onChange - Callback function triggered when value changes
 * @param rows - Array of row data
 * @param maxLength - maxLength prop
 */
declare const TextArea: {
    ({ ref, ...props }: TextAreaProps & {
        ref?: Ref<HTMLTextAreaElement>;
    }): react.JSX.Element;
    displayName: string;
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

/**
 * TextWheel component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TextWheel items={["Option 1", "Option 2", "Option 3"]} onChange={(selected) => console.log(selected)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TextWheel items={[{ label: "Red", value: "red" }, { label: "Blue", value: "blue" }]} onChange={(val) => console.log(val)} />
 * ```
 * @param items - Array of items
 * @param onChange - Callback function triggered when value changes
 */
declare const TextWheel: react__default.ForwardRefExoticComponent<Omit<TextWheelProps, "ref"> & react__default.RefAttributes<TextWheelHandler>>;

/** Engine config only — no `layers` (those are declared on child elements via the `timeline` prop). */
type TimelineConfig = Omit<TimelineOptions, "layers">;
/**
 * Props for the `TimelineProvider` context wrapper.
 *
 * @example
 * ```tsx
 * // Wrap at page/section level — engine config only, no layers here
 * <TimelineProvider timeline={{ mode: "scroll", interpolate: true, lerpFactor: 0.08 }}>
 *   <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>
 *     Hero content
 *   </Box>
 *   <Box timeline={{ id: "tagline", entry: { delay: 0.25, y: [60, 0, "$spring"] } }}>
 *     Tagline
 *   </Box>
 * </TimelineProvider>
 *
 * // Or consume effects manually in a child:
 * function HeroSection() {
 *   const tl = useTimelineContext<"hero" | "tagline">()!;
 *   return <div style={tl.effects.hero}>…</div>;
 * }
 * ```
 */
interface TimelineProviderProps {
    /** Engine config (mode, interpolate, lerpFactor, etc.) — layers are registered by children */
    timeline: TimelineConfig;
    children?: ReactNode;
    className?: string;
}
/** Full context value: all of UseTimelineReturn plus layer registration helpers */
interface TimelineContextValue extends UseTimelineReturn<string> {
    registerLayer: (layer: TimelineLayer) => void;
    unregisterLayer: (id: string) => void;
}

/**
 * Wrap a page or section. Engine config only — individual components declare their
 * own layers via the `timeline` prop, which `useBase` registers automatically.
 *
 * @example
 * ```tsx
 * <TimelineProvider timeline={{ mode: "scroll", interpolate: true, lerpFactor: 0.08 }}>
 *   <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>…</Box>
 *   <Box timeline={{ id: "card", entry: { delay: 0.25, y: [60, 0, "$spring"] } }}>…</Box>
 * </TimelineProvider>
 * ```
 */
declare const TimelineProvider: FC<TimelineProviderProps>;
/**
 * Consume the nearest `TimelineProvider` state. Returns `null` outside a provider.
 *
 * @example
 * ```tsx
 * const tl = useTimelineContext<"hero" | "card">()!;
 * <div style={tl.effects.hero}>…</div>
 * ```
 */
declare const useTimelineContext: <Id extends string = string>() => (TimelineContextValue & {
    effects: Record<Id, Record<string, string | number>>;
}) | null;

/**
 * Toast component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Toast message="Operation successful" type="success" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Toast message="Error occurred" type="error" duration={5000} action={{ label: "Retry", onClick: () => {} }} />
 * ```
 * @param message - Message text or element
 * @param type - Component or input type
 * @param duration - duration prop
 * @param action - action prop
 */
declare const Toast: FC<ToastProps & {
    index: number;
    total: number;
    isHovered: boolean;
    forceClose?: boolean;
}>;

interface TokenProps {
    id?: string;
    label: string;
    subLabel?: string;
    icon?: string;
    color?: string;
    removable?: boolean;
    variant?: ValueOf<typeof Variant>;
    ref?: React.Ref<HTMLDivElement>;
    render?: (props: TokenProps) => React.ReactNode;
    onClick?: (token: TokenProps) => void;
    onRemove?: (token: TokenProps) => void;
}

declare const Token: (props: TokenProps) => react.JSX.Element;

/**
 * Tooltip component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Tooltip content="Helpful text">Hover me</Tooltip>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Tooltip content="Full description here" position="top" delay={200} variant="dark">Information icon</Tooltip>
 * ```
 * @param content - Content text or element
 * @param position - position prop
 * @param delay - delay prop
 * @param variant - Visual variant or style
 */
declare const ToolTip: {
    ({ ref, ...props }: ToolTipProps & {
        ref?: Ref<ToolTipController>;
    }): react.JSX.Element;
    displayName: string;
};

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

/**
 * TreeView component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Treeview roots={["root"]} nodes={[{ tag: "root", label: "Root", isHead: true }]} onNodeSelect={(tag) => console.log(tag)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Treeview roots={["root"]} nodes={[{ tag: "root", label: "Root", isHead: true, expanded: true }, { tag: "child", label: "Child", under: "root" }]} selected="root" onNodeSelect={(tag) => console.log(tag)} />
 * ```
 * @param roots - Root node identifiers
 * @param nodes - Tree node definitions
 * @param onNodeSelect - Callback function triggered on node selection
 * @param selected - Currently selected item/date
 */
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
    spinner?: SpinnerProps;
    /** Toast Default Settings */
    toast?: {
        variant?: ValueOf<typeof Variant>;
        position?: ToastPosition;
        style?: ToastStyle;
        transition?: ValueOf<typeof TRANSITIONS>;
        curve?: ValueOf<typeof TRANSITION_CURVES>;
        type?: ToastType;
        duration?: number;
        progress?: boolean;
    };
    /** Tooltip Default Settings */
    tooltip?: {
        variant?: ValueOf<typeof Variant>;
        transition?: ToolTipTransition;
        curve?: ValueOf<typeof TRANSITION_CURVES>;
    };
    /** Enable squircle shapes across app */
    squircle?: boolean;
}
type ThemeContextProps = {
    colorScheme: ColorScheme;
    resolvedScheme: `light` | `dark`;
    setColorScheme: (theme: ColorScheme) => void;
} & ThemeConfig;
type ThemeProviderProps = {
    children: ReactNode;
    forceTheme?: ColorScheme;
    storageKey?: string;
} & ThemeConfig;
declare const useTheme: (ignoreContext?: boolean) => ThemeContextProps | undefined;
declare const ThemeProvider: ({ children, storageKey, forceTheme, zuzMap, ...conf }: ThemeProviderProps) => react.JSX.Element;

interface ScrollSceneConfig {
    start: number;
    inEnd: number;
    outStart: number;
    end: number;
    fromY?: string;
    atY?: string;
    outY?: string;
    fromOpacity?: number;
    atOpacity?: number;
    outOpacity?: number;
    easing?: string;
    willChange?: string;
    entry?: ScrollEntryConfig;
}
interface ScrollEntryLegacyConfig {
    fromY?: string;
    toY?: string;
    fromOpacity?: number;
    toOpacity?: number;
    fromScale?: number;
    toScale?: number;
}
interface ScrollEntryConfig extends Partial<TimelineEntry>, ScrollEntryLegacyConfig {
    duration?: number;
    delay?: number;
    easing?: string;
}
interface ScrollTrackKeyframe {
    at: number;
    y?: string;
    opacity?: number;
    scale?: number;
}
interface ScrollTrackConfig {
    keyframes: ScrollTrackKeyframe[];
    timeline?: string;
    easing?: string;
    willChange?: string;
    entry?: ScrollEntryConfig;
}
interface ScrollScenesConfig {
    id: string;
    timeline?: string;
    scrollContainerSelector?: string;
    scenes: Record<string, ScrollSceneConfig>;
    tracks?: Record<string, ScrollTrackConfig>;
}
interface ScrollScenesModel {
    id: string;
    scopeClass: string;
    timelineName: string;
    scrollContainerSelector?: string;
    entryNames: Record<string, boolean>;
    panelClasses: Record<string, string>;
    trackClasses: Record<string, string>;
    allClasses: Record<string, string>;
    fallbackLayers: Record<string, TimelineLayer>;
    cssText: string;
}
declare const buildScrollScenesModel: (config: ScrollScenesConfig) => ScrollScenesModel;

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
declare const animationTransition: (transition: ValueOf<typeof TRANSITIONS>, startOffset?: number, endOffset?: number) => {
    from: {};
    to: {};
};
declare const getAnimationTransition: (transition: ValueOf<typeof TRANSITIONS>, to?: boolean, from?: boolean) => dynamic;

declare const useBase: <T extends keyof JSX.IntrinsicElements>(props: Props<T>, ref?: RefObject<HTMLElement>) => {
    style: CSSProperties;
    className: string;
    rest: ComponentPropsWithRef<T>;
};

declare const useColorPicker: () => {
    show: (node: ReactNode) => number;
    update: (id: number, node: ReactNode) => void;
    hide: (id: number) => void;
    clearAll: () => void;
};

declare const useContextMenu: () => {
    showContextMenu: (e: MouseEvent$1<Element, MouseEvent> | TouchEvent, items: ContextItem[], origin?: ValueOf<typeof ORIGIN>, width?: number | string, onClose?: (id: number) => void) => void;
    showMenu: (ref: RefObject<HTMLElement | null>, { items, origin, offsetX, offsetY, transition, curve, arrow, arrowSide, arrowAlign, duration, header, footer, width, onClose, }: {
        transition?: ValueOf<typeof TRANSITIONS>;
        curve?: ValueOf<typeof TRANSITION_CURVES>;
        arrow?: boolean;
        arrowSide?: ContextMenuArrowSide;
        arrowAlign?: ContextMenuArrowAlign;
        duration?: number;
        offsetX?: number;
        offsetY?: number;
        items: ContextItem[];
        origin?: ValueOf<typeof ORIGIN>;
        header?: ReactNode | FC;
        footer?: ReactNode | FC;
        width?: number | string;
        onClose?: (id: number) => void;
    }) => void;
    hide: (type: LayerType) => void;
};

declare const useDialog: () => {
    clearAll: () => void;
    show: (pops: Omit<DialogProps, `id`>) => DialogController;
    confirm: (pops: Omit<DialogProps, `id` | `onShow` | `onHide`> & {
        confirmLabel?: string;
        cancelLabel?: string;
    }) => DialogController;
    hide: (id: number) => void;
};

type DrawerOptions = Omit<DrawerProps, 'id' | 'onShow' | 'onHide' | 'from' | 'children'>;
declare const useDrawer: () => {
    clearAll: () => void;
    open: (child?: string | ReactNode | ReactNode[], options?: DrawerOptions) => DrawerController;
    right: (child?: string | ReactNode | ReactNode[], options?: DrawerOptions) => DrawerController;
    left: (child?: string | ReactNode | ReactNode[], options?: DrawerOptions) => DrawerController;
    top: (child?: string | ReactNode | ReactNode[], options?: DrawerOptions) => DrawerController;
    bottom: (child?: string | ReactNode | ReactNode[], options?: DrawerOptions) => DrawerController;
    close: (id?: number) => void;
};

declare const useFx: (fx?: animationProps & {
    /** Offset when transition is activce */
    offset?: number;
    /** Offset when transition is inactive */
    margin?: number;
    watch?: string[];
}, ref?: RefObject<HTMLElement>) => {
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

declare const useReducedMotion: () => boolean;

interface UseScrollScenesReturn {
    scopeClass: string;
    panel: Record<string, string>;
    track: Record<string, string>;
    supportsScrollTimeline: boolean;
    className: (sceneName: string) => string;
    timeline: (name: string) => TimelineLayer | undefined;
    cssText: string;
}
declare const useScrollScenes: (config: ScrollScenesConfig) => UseScrollScenesReturn;

interface SnackProps {
    title: string;
    message?: string;
    icon?: string;
    duration?: number;
    sticky?: boolean;
    position?: ToastPosition;
    style?: ToastStyle;
    actions?: ToastAction[];
    progress?: boolean;
    progressValue?: number;
    width?: number | string;
}
interface SnackBtn {
    label?: string;
    hide?: boolean;
    tag?: string;
    buttonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
    onClick?: (e: any) => void;
}
type SnackPatch = Partial<Omit<ToastProps, 'id' | 'onClose'>>;
interface SnackController {
    id: number;
    update: (props: SnackPatch) => void;
    setType: (type: ToastType) => void;
    setProgress: (progress: number) => void;
    setBusy: (busy: boolean) => void;
    success: () => void;
    error: () => void;
    warn: () => void;
    promise: () => void;
    default: () => void;
    hide: () => void;
}
declare const useSnack: () => {
    show: (props: SnackProps) => SnackController;
    hide: (id: number) => void;
    promise: (props: SnackProps) => SnackController;
    clearAll: () => void;
    ok: (props: SnackProps, ok?: SnackBtn) => SnackController;
    success: (props: SnackProps, ok?: SnackBtn) => SnackController;
    error: (props: SnackProps, ok?: SnackBtn) => SnackController;
    confirm: (props: SnackProps, ok?: SnackBtn, cancel?: SnackBtn) => SnackController;
    warn: (props: SnackProps, ok?: SnackBtn) => SnackController;
    succes: (props: SnackProps, ok?: SnackBtn) => SnackController;
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

type CalendarNavUnit = "day" | "week" | "month" | "year";
type QuickOption = {
    label: string;
    getDate: () => Date;
    getDateFormat: () => string;
};
type UseCalendarProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    range?: boolean;
    rangeValue?: CalendarRangeValue;
    defaultRangeValue?: CalendarRangeValue;
    selectYear?: boolean;
    /** First day of the week for the month grid. 0 = Sunday, 1 = Monday. @default 0 */
    weekStartsOn?: CalendarWeekStartDay;
    onChange?: (date: Date | null, meta?: {
        source: CalendarChangeSource;
    }) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    formValue?: unknown;
    inForm?: boolean;
    name?: string;
    formSetFieldValue?: (name: string, value: any) => void;
};
type UseCalendarReturn = {
    current: Date | null;
    visibleMonth: Date;
    visibleYear: number;
    visibleLabel: string;
    currentRange: CalendarRangeValue;
    today: Date;
    weekStartsOn: CalendarWeekStartDay;
    days: Date[];
    daysInMonth: Date[];
    weeks: Date[][];
    weekDays: string[];
    gridStart: Date;
    gridEnd: Date;
    weekStart: Date;
    weekEnd: Date;
    isRangeMode: boolean;
    showQuickOptions: boolean;
    visibleQuickOptions: QuickOption[];
    isDateDisabled: (date: Date) => boolean;
    isToday: (date: Date) => boolean;
    isSelected: (date: Date) => boolean;
    isInRange: (date: Date) => boolean;
    disablePrevDay: boolean;
    disableNextDay: boolean;
    disablePrevWeek: boolean;
    disableNextWeek: boolean;
    disablePrevMonth: boolean;
    disableNextMonth: boolean;
    disablePrevYear: boolean;
    disableNextYear: boolean;
    rangeStart: Date | null;
    rangeEnd: Date | null;
    yearOptions: {
        label: string;
        value: string;
    }[];
    monthOptions: {
        label: string;
        value: string;
    }[];
    selectedYearOption: {
        label: string;
        value: string;
    } | null;
    selectedMonthOption: {
        label: string;
        value: string;
    } | null;
    handleDateClick: (date: Date) => void;
    selectDate: (date: Date) => void;
    clearSelection: () => void;
    clearRange: () => void;
    setRange: (range: CalendarRangeValue) => void;
    goto: (unit: CalendarNavUnit, amount?: number) => void;
    canGoto: (unit: CalendarNavUnit, amount?: number) => boolean;
    gotoDate: (date: Date, options?: {
        select?: boolean;
    }) => void;
    gotoToday: () => void;
    gotoPrevDay: () => void;
    gotoNextDay: () => void;
    gotoPrevWeek: () => void;
    gotoNextWeek: () => void;
    gotoPrevMonth: () => void;
    gotoNextMonth: () => void;
    gotoPrevYear: () => void;
    gotoNextYear: () => void;
    handleYearChange: (yearValue: string | number) => void;
    handleMonthChange: (monthValue: string | number) => void;
    setVisibleMonth: (date: Date) => void;
    setCurrent: (date: Date | null) => void;
    setCurrentRange: (range: CalendarRangeValue) => void;
    getDayProps: (day: Date) => {
        isCurrentMonth: boolean;
        isDisabled: boolean;
        isSelected: boolean;
        isCurrentDay: boolean;
        isRangeStart: boolean;
        isRangeEnd: boolean;
        isRangeDay: boolean;
        isMiddleRangeDay: boolean;
    };
};
/**
 * Calendar state, month grid, range selection, and navigation.
 *
 * @example
 * ```tsx
 * const calendar = useCalendar({
 *   onChange: (date) => console.log(date),
 *   minDate: new Date(2024, 0, 1),
 *   weekStartsOn: 1,
 * });
 *
 * calendar.gotoToday();
 * calendar.goto("week", 1);
 * calendar.gotoPrevMonth();
 * ```
 */
declare const useCalendar: (props?: UseCalendarProps) => UseCalendarReturn;

export { ALERT, AVATAR, Accordion, type AccordionHandler, type AccordionProps, ActionBar, type ActionBarHandler, type ActionBarItem, type ActionBarProps, type AgentActivityBlock, type AgentActivityOptions, type AgentApprovalOptions, AgentChat, type AgentChatBrand, type AgentChatProps, type AgentComposerControls, type AgentComposerModel, type AgentToolInvocation, Alert, type AlertHandler, type AlertProps, type AnimationTransition, type Appearance, AutoComplete, type AutoCompleteDynamicOptions, type AutoCompleteProps, Avatar, type AvatarHandler, type AvatarProps, Badge, type BadgeProps, Box, type BoxProps, type BubbleAttachment, BubbleAttachmentType, BubbleMediaType, type BubbleProps, BubbleStatus, type BubbleStylePreset, Button, type ButtonHandler, type ButtonProps, ButtonState, CHART, CHECKBOX, COLORTHEME, Calendar, type CalendarAppointment, type CalendarAppointmentOverlap, type CalendarAppointmentRenderProps, type CalendarChangeSource, type CalendarDisabledDateInput, type CalendarDisabledTimeRange, type CalendarDragMode, type CalendarNavUnit, type CalendarProps, type CalendarQuickOptionInput, type CalendarQuickOptionLabel, type CalendarRangeValue, type CalendarTimeRange, type CalendarTimeSlot, type CalendarViewMode, type CalendarWeekStartDay, Carousel, type CarouselEffect, type CarouselProps, Chart, type ChartProps, Bubble as ChatBubble, type ChatDateLabelFormatter, type ChatDateLabels, ChatList, type ChatListProps, type ChatMessage, CheckBox, type CheckBoxProps, type CheckboxHandler, CodeBlock, type CodeBlockProps, type CodeLanguage, ColorPicker, type ColorPickerProps, ColorScheme$1 as ColorScheme, type ColorValue, type Column, type ContextItem, type ContextItemConfig, ContextMenu, type ContextMenuArrowAlign, type ContextMenuArrowSide, type ContextMenuHandler, type ContextMenuProps, type CookieConsentProps, CookiesConsent, Countries, type Country, Cover, type CoverProps, type CropHandler, CropShape, Cropper, type CropperProps, Crumb, type CrumbItem, type CrumbProps, DATATYPE, DIALOG, DIALOG_ACTION_POSITION, DRAWER_SIDE, DatePicker, DependencyTree, type DependencyTreeNode, type DependencyTreeProps, type DependencyTreeRenderContext, type DependencyTreeRenderNode, Dialog, type DialogActionHandler, type DialogConfirmClose, type DialogConfirmOptions, DialogContext, type DialogContextType, type DialogController, type DialogHandler, type DialogProps, Drawer, type DrawerConfirmClose, type DrawerConfirmOptions, DrawerContext, type DrawerContextType, type DrawerController, type DrawerHandler, type DrawerProps, FILTER, FORMVALIDATION, FORMVALIDATION_STYLE, Fab, type FabProps, Fieldset, type FieldsetProps, type FilterProps, Filters, Flex, type FlexProps, Form, type FormDataResult, type FormHandler, type FormInputs, type FormProps, type FormValidation, Grid, type GridBreakpoints, type GridProps, Group, type GroupProps, Icon, type IconProps, Image, type ImageProps, Input, type InputMaskOptions, type InputProps, type KeyCombination, type KeyboardKey, type KeyboardKeyProps, KeyBoardKeys as KeyboardKeys, KeysLabelMap, KeysMap, Label, type LabelProps, type LargeCalendarProps, type LayerHandler, LayersProvider, Lightbox, type LightboxProps, List, type ListHandler, type ListItem, type ListItemMeta, type ListItemObject, type ListProps, type ListRender, type ListRenderContext, type LoopMode, MagneticGrid, type MagneticGridProps, MediaPlayer, type MediaPlayerContextType, type MediaPlayerController, type MediaPlayerIcons, type MediaPlayerProps, type MenuItemProps, type MorphOptions, type NetworkManagerprops, NetworkManager as NetworkStatus, ORIGIN, type Option, type OptionItemProps, OriginType, Overlay, type OverlayProps, P, PACKAGE_NAME, PLACEMENTS, POSITION, PROGRESS, Pagination, type PaginationCallback, type PaginationController, type PaginationPage, type PaginationPageItem, type PaginationProps, PaginationStyle, Password, type PasswordProps, PhoneInput, type PhoneInputProps, type PhoneInputValue, PinInput, type PinInputProps, type Placement, Position, ProgressBar, type ProgressBarProps, type ProgressHandler, type Props, type QuickOption, RADIO, Radio, type RadioHandler, type RadioProps, type Row, type RowSelectCallback, SHEET, SHEET_ACTION_POSITION, SKELETON, SLIDER, SORT, SPINNER, type ScrollEntryConfig, type ScrollSceneConfig, type ScrollScenesConfig, type ScrollScenesModel, type ScrollTrackConfig, type ScrollTrackKeyframe, ScrollView, type ScrollViewDirection, type ScrollViewProps, Search, type SearchHandler, type SearchProps, type Segment, type SegmentController, type SegmentItemProps, type SegmentProps, Select, type SelectEditableChange, type SelectEditableProps, type SelectHandler, type SelectInternalProps, type SelectMultipleChange, type SelectMultipleProps, type SelectPrimitive, type SelectProps, type SelectSingleChange, type SelectSingleProps, type SelectSingleValue, Segmented as SelectTabs, type SelectTokenizerProps, type SelectValue, Sheet, type SheetHandler, type SheetProps, type Skeleton, Slider, type SliderController, type SliderProps, type ToastAction as SnackAction, type SnackController, ToastPosition as SnackPosition, ToastStyle as SnackStyle, ToastType as SnackType, Span, type SpanProps, Spinner, type SpinnerProps, Stack, type StackProps, Status, type Step, Steps, type StepsProps, Switch, type CheckboxHandler as SwitchHandler, TRANSITIONS, TRANSITION_CURVES, type Tab, type TabBodyProps, type TabProps, TabView, type TabViewHandler, type TabViewProps, ForwardedTable as Table, type TableController, type TableOfContentItem, TableOfContents, type TableOfContentsProps, type TableProps, type TableSortCallback, Terminal, type TerminalCommandFn, type TerminalCommands, type TerminalHandler, type TerminalLine, type TerminalProps, Text, type TextAreaProps, TextWheel, type TextWheelHandler, type TextWheelProps, TextArea as Textarea, ThemeProvider, TimePicker, type TimePickerInputValue, type TimePickerProps, type TimePickerValue, TimelineProvider, type TimelineProviderProps, type ToastAction, ToastDefaultTitle, ToastPosition, type ToastProps, Toast as ToastProvider, ToastStyle, ToastType, Token, type TokenProps, ToolTip, type ToolTipController, type ToolTipProps, type ToolTipTransition, type TreeItemHandler, type TreeItemProps, type TreeNode, type TreeNodeIcons, TreeView, type TreeViewHandler, type TreeViewProps, type UseCalendarProps, type UseCalendarReturn, type UseScrollScenesReturn, type ValidationResult, type ValidationSchema, type Value, type ValueOf, Variant, type VirtualScrollOptions, type WithFormValidation, type ZuzCommonValues, type ZuzProps, type ZuzStyleString, type ZuzTimelineProp, VERSION as __ZUZJS_UI_VERSION, type animationProps, animationTransition, buildClassString, buildScrollScenesModel, buildWithStyles, cleanProps, css, type cssShortKey, type cssShortKeys, type dynamic, getAnimationCurve, getAnimationTransition, getZuzMap, isKeyCombination, type parallaxEffectProps, setZuzMap, splitAtoms, useBase, useCalendar, useColorPicker, useContextMenu, useDialog, useDialogDirty, useDrawer, useDrawerDirty, useForm, useFx, useContextMenu as useMenu, useMorph, usePosition, useReducedMotion, useScrollScenes, useScrollView, useSnack, useTheme, useTimelineContext, useToast };
