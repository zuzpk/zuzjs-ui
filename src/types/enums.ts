export enum FILTER {
    Gooey = "gooey"
}

export enum SPINNER {
    Simple = "SIMPLE",
    Roller = "ROLLER",
    Wave = "Wave"
}

export enum SLIDER {
    Default = "range",
    Text = "number"
}

export enum FORMVALIDATION_STYLE {
    Dots = "DOTS"
}

export enum FORMVALIDATION {
    Email = "EMAIL",
    Uri = "URI",
    Password = "PASSWORD",
    MatchField = "MATCHFIELD",
    Pattern = "*"
}

export enum SHEET {
    Dialog = "DIALOG",
    Default = "DEFAULT",
    Error = "ERROR",
    Success = "SUCCESS",
    Warn = "WARN",
}

export enum SHEET_ACTION_POSITION {
    Left = "LEFT",
    Right = "RIGHT",
    Center = "CENTER"
}

export enum TRANSITION_CURVES {
    Spring = "SPRING",
    // Ease = "EASE",
    // EaseIn = "EASEIN",
    // EaseOut = "EASEOUT",
    Liquid = "LIQUID",
    EaseInOut = "EASEINOUT",
    Bounce = "BOUNCE",
    // Linear = "LINEAR",
    // StepStart = "STEPSTART",
    // StepEnd = "STEPEND",
    // Steps = "STEPS",
    // CubicBezier = "CUBICBEZIER"
}

export enum TRANSITIONS {
    
    FadeIn = "FADE_IN",
    ScaleIn = "SCALE_IN",

    SlideInTop = "SLIDE_FROM_TOP",
    SlideInRight = "SLIDE_FROM_RIGHT",
    SlideInBottom = "SLIDE_FROM_BOTTOM",
    SlideInLeft = "SLIDE_FROM_LEFT",
    
    
    // Zoom = "ZOOM",
    // Bounce = "BOUNCE",
    // Flip = "FLIP",
    // Rotate = "ROTATE",
    // Pulse = "PULSE",
    // Shake = "SHAKE"
}

export enum DRAWER_SIDE {
    Left = "LEFT",
    Right = "RIGHT",
    Top = "TOP",
    Bottom = "BOTTOM"
}

export enum CHECKBOX {
    Default = "DEFAULT",
    Switch = "SWITCH"
}

export enum RADIO {
    Default = "DEFAULT",
    Card = "CARD"
}

export enum EDIT_TYPE {
    Slider = "SLIDER",
    Checkbox = "CHECKBOX"
}

export enum DATATYPE {
    String = "STRING",
    Number = "NUMBER",
    Boolean = "BOOLEAN",
    Array = "ARRAY",
    Object = "OBJECT",
    Date = "DATE",
    Time = "TIME",
    DateTime = "DATETIME",
    File = "FILE"
}

export enum SORT {
    Asc = "ASC",
    Desc = "DESC"
}

export enum PROGRESS {
    Bar = "BAR",
    Ring = "RING"
}

export enum SKELETON {
    Default = "DEFAULT",
    Circle = "CIRCLE"
}

export enum ALERT {
    Success = "success",
    Error = "error",
    Warning = "warning",
    Info = "info"
}

export enum AVATAR {
    Circle = "CIRCLE",
    Square = "SQUARE"
}

export enum KeyCode {
    
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    PauseBreak = 19,
    Command = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    ArrowLeft = 37,
    ArrowUp = 38,
    ArrowRight = 39,
    ArrowDown = 40,
    Insert = 45,
    Delete = 46,
  
    // Number keys
    Digit0 = 48,
    Digit1 = 49,
    Digit2 = 50,
    Digit3 = 51,
    Digit4 = 52,
    Digit5 = 53,
    Digit6 = 54,
    Digit7 = 55,
    Digit8 = 56,
    Digit9 = 57,
  
    // Letter keys
    KeyA = 65,
    KeyB = 66,
    KeyC = 67,
    KeyD = 68,
    KeyE = 69,
    KeyF = 70,
    KeyG = 71,
    KeyH = 72,
    KeyI = 73,
    KeyJ = 74,
    KeyK = 75,
    KeyL = 76,
    KeyM = 77,
    KeyN = 78,
    KeyO = 79,
    KeyP = 80,
    KeyQ = 81,
    KeyR = 82,
    KeyS = 83,
    KeyT = 84,
    KeyU = 85,
    KeyV = 86,
    KeyW = 87,
    KeyX = 88,
    KeyY = 89,
    KeyZ = 90,
  
    // Numpad keys
    Numpad0 = 96,
    Numpad1 = 97,
    Numpad2 = 98,
    Numpad3 = 99,
    Numpad4 = 100,
    Numpad5 = 101,
    Numpad6 = 102,
    Numpad7 = 103,
    Numpad8 = 104,
    Numpad9 = 105,
    NumpadMultiply = 106,
    NumpadAdd = 107,
    NumpadSubtract = 109,
    NumpadDecimal = 110,
    NumpadDivide = 111,
  
    // Function keys
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
  
    // Other keys
    NumLock = 144,
    ScrollLock = 145,
    Semicolon = 186,  // ;
    Equal = 187,      // =
    Comma = 188,      // ,
    Minus = 189,      // -
    Period = 190,     // .
    Slash = 191,      // /
    Backquote = 192,  // `
    BracketLeft = 219,  // [
    Backslash = 220,    // \
    BracketRight = 221, // ]
    Quote = 222,        // '
}

export enum SHIMMER {
    Classic = "CLASSIC",
    Aurora = "AURORA",
    Flame = "FLAME",
}

export enum DRAG_DIRECTION {
    x = "x",
    y = "y",
    xy = "xy"
}

export enum Size {
    Default = `def`,
    Small = `sm`,
    Medium = `md`,
    Large = `lg`
}

export enum Variant {
    Default = `def`,
    Small = `sm`,
    Medium = `md`,
    Large = `lg`,
    XLarge = `xl`,
}


export enum Position {
    Auto = `auto`,
    Top = `top`,
    Bottom = `bottom`,
    Left = `left`,
    Right = `right`
}

export enum ColorTheme {
    Light = "light",
    Dark = "dark",
    System = "system",
}