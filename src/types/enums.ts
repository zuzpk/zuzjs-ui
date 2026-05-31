import { AnchorType } from "@zuzjs/hooks";

export const AVATAR = {
    Circle : "CIRCLE",
    Square : "SQUARE"
} as const

export const SKELETON = {
    Default: "DEFAULT",
    Circle: "CIRCLE"
} as const;

export const COLORTHEME = {
    Light: "light",
    Dark: "dark",
    System: "system"
} as const;

export const CHECKBOX = {
    Default : "DEFAULT",
    Switch : "SWITCH"
} as const

export const POSITION = {
    Auto : `auto`,
    Top : `top`,
    Bottom : `bottom`,
    Left : `left`,
    Right : `right`
} as const
export const Position = POSITION

export const ORIGIN = AnchorType
export const OriginType = ORIGIN

export const PLACEMENTS = {
    // Top
    Top: 'top',
    TopStart: 'top-start',
    TopCenter: 'top-center',
    TopEnd: 'top-end',

    // Bottom
    Bottom: 'bottom',
    BottomStart: 'bottom-start',
    BottomCenter: 'bottom-center',
    BottomEnd: 'bottom-end',

    // Left
    Left: 'left',
    LeftStart: 'left-start',
    LeftCenter: 'left-center',
    LeftEnd: 'left-end',

    // Right
    Right: 'right',
    RightStart: 'right-start',
    RightCenter: 'right-center',
    RightEnd: 'right-end',
} as const;

export const Variant = {
    XSmall : `xs`,
    Small : `sm`,
    Medium : `md`,
    Large : `lg`,
    XLarge : `xl`,
} as const

export const SORT = {
    Asc : "ASC",
    Desc : "DESC"
} as const

export const DATATYPE = {
    String : "STRING",
    Number : "NUMBER",
    Boolean : "BOOLEAN",
    Array : "ARRAY",
    Object : "OBJECT",
    Date : "DATE",
    Time : "TIME",
    DateTime : "DATETIME",
    File : "FILE"
} as const

export const FORMVALIDATION_STYLE = {
    Dots : "DOTS"
} as const

export const FORMVALIDATION = {
    IPV4 : "IPV4",
    IPV6 : "IPV6",
    Email : "EMAIL",
    Uri : "URI",
    Password : "PASSWORD",
    MatchField : "MATCHFIELD",
    Pattern : "*",
    GreaterThan : "GREATER_THAN",
    NotEmpty : "NOT_EMPTY", 
    NotMinusOne : "NOT_MINUS_ONE",
    // Date Validations
    /** Ensures date is not in the past (includes today) */
    MinDateToday: "MIN_DATE_TODAY",
    /** Ensures date is after a specific threshold */
    MinDate: "MIN_DATE",
    /** Ensures date does not exceed today or a specific threshold */
    MaxDate: "MAX_DATE",
} as const

export const ALERT = {
    Default: "default",   // Neutral state, often gray/muted
    Success : "success",
    Error : "error",
    Warning : "warning",
    Info : "info",
    Primary: "primary",   // Matches the brand color (Zuz primary)
    Secondary: "secondary", 
    Neutral: "neutral",   // Specifically for "low priority" or "muted" alerts
    Critical: "critical", // Higher intensity than Error (often used for system-wide failures)
    Tip: "tip",           // Specifically for onboarding or suggestions (often purple/indigo)
    Draft: "draft",
} as const

export const TRANSITION_CURVES = {
    Spring : "SPRING",
    Ease: "EASE",
    EaseIn: "EASEIN",
    EaseOut: "EASEOUT",
    Liquid : "LIQUID",
    EaseInOut : "EASEINOUT",
    EaseOutBack: "EASEOUTBACK",
    Bounce : "BOUNCE",
    Linear: "LINEAR",
    // StepStart = "STEPSTART",
    // StepEnd = "STEPEND",
    // Steps = "STEPS",
    // CubicBezier = "CUBICBEZIER"
} as const

export const TRANSITIONS = {
    
    FadeIn : "FADE_IN",
    ScaleIn : "SCALE_IN",

    SlideInTop : "SLIDE_FROM_TOP",
    SlideInRight : "SLIDE_FROM_RIGHT",
    SlideInBottom : "SLIDE_FROM_BOTTOM",
    SlideInTopScale : "SLIDE_FROM_TOP_SCALE",
    SlideInBottomScale : "SLIDE_FROM_BOTTOM_SCALE",
    SlideInLeft : "SLIDE_FROM_LEFT",

    Zoom: "ZOOM",
    Bounce: "BOUNCE",
    Flip: "FLIP",
    Rotate: "ROTATE",
    Pulse: "PULSE",
    Shake: "SHAKE"
} as const

export const Status = {
    None: "none",
    Success: "success",
    Error: "error", 
    Idle: "idle", 
    Dead: "dead"
} as const

export const SHEET = {
    Dialog : "DIALOG",
    Default : "DEFAULT",
    Error : "ERROR",
    Success : "SUCCESS",
    Warn : "WARN",
    Promise : 'PROMISE',
    Confirm : "CONFIRM",
} as const
export const DIALOG = SHEET

export const SHEET_ACTION_POSITION = {
    Left : "LEFT",
    Right : "RIGHT",
    Center : "CENTER"
} as const
export const DIALOG_ACTION_POSITION = SHEET_ACTION_POSITION;

export const PROGRESS = {
    Bar : "BAR",
    Ring : "RING"
} as const

export const SLIDER = {
    Default : "range",
    Text : "number"
} as const

export const RADIO = {
    Default : "DEFAULT",
    Card : "CARD"
} as const

export const FILTER = {
    Gooey : "gooey"
} as const

export const DRAWER_SIDE = {
    Left : "LEFT",
    Right : "RIGHT",
    Top : "TOP",
    Bottom : "BOTTOM"
} as const