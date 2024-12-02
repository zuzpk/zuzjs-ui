export var FILTER;
(function (FILTER) {
    FILTER["Gooey"] = "gooey";
})(FILTER || (FILTER = {}));
export var SPINNER;
(function (SPINNER) {
    SPINNER["Simple"] = "SIMPLE";
    SPINNER["Roller"] = "ROLLER";
    SPINNER["Wave"] = "Wave";
})(SPINNER || (SPINNER = {}));
export var SLIDER;
(function (SLIDER) {
    SLIDER["Default"] = "range";
    SLIDER["Text"] = "number";
})(SLIDER || (SLIDER = {}));
export var FORMVALIDATION_STYLE;
(function (FORMVALIDATION_STYLE) {
    FORMVALIDATION_STYLE["Dots"] = "DOTS";
})(FORMVALIDATION_STYLE || (FORMVALIDATION_STYLE = {}));
export var FORMVALIDATION;
(function (FORMVALIDATION) {
    FORMVALIDATION["Email"] = "EMAIL";
    FORMVALIDATION["Uri"] = "URI";
    FORMVALIDATION["Password"] = "PASSWORD";
    FORMVALIDATION["MatchField"] = "MATCHFIELD";
})(FORMVALIDATION || (FORMVALIDATION = {}));
export var SHEET;
(function (SHEET) {
    SHEET["Dialog"] = "DIALOG";
    SHEET["Default"] = "DEFAULT";
    SHEET["Error"] = "ERROR";
    SHEET["Success"] = "SUCCESS";
    SHEET["Warn"] = "WARN";
})(SHEET || (SHEET = {}));
export var SHEET_ACTION_POSITION;
(function (SHEET_ACTION_POSITION) {
    SHEET_ACTION_POSITION["Left"] = "LEFT";
    SHEET_ACTION_POSITION["Right"] = "RIGHT";
    SHEET_ACTION_POSITION["Center"] = "CENTER";
})(SHEET_ACTION_POSITION || (SHEET_ACTION_POSITION = {}));
export var TRANSITION_CURVES;
(function (TRANSITION_CURVES) {
    TRANSITION_CURVES["Spring"] = "SPRING";
    // Ease = "EASE",
    // EaseIn = "EASEIN",
    // EaseOut = "EASEOUT",
    TRANSITION_CURVES["EaseInOut"] = "EASEINOUT";
    TRANSITION_CURVES["Bounce"] = "BOUNCE";
    // Linear = "LINEAR",
    // StepStart = "STEPSTART",
    // StepEnd = "STEPEND",
    // Steps = "STEPS",
    // CubicBezier = "CUBICBEZIER"
})(TRANSITION_CURVES || (TRANSITION_CURVES = {}));
export var TRANSITIONS;
(function (TRANSITIONS) {
    TRANSITIONS["FadeIn"] = "FADE_IN";
    TRANSITIONS["ScaleIn"] = "SCALE_IN";
    TRANSITIONS["SlideInTop"] = "SLIDE_FROM_TOP";
    TRANSITIONS["SlideInRight"] = "SLIDE_FROM_RIGHT";
    TRANSITIONS["SlideInBottom"] = "SLIDE_FROM_BOTTOM";
    TRANSITIONS["SlideInLeft"] = "SLIDE_FROM_LEFT";
    // Zoom = "ZOOM",
    // Bounce = "BOUNCE",
    // Flip = "FLIP",
    // Rotate = "ROTATE",
    // Pulse = "PULSE",
    // Shake = "SHAKE"
})(TRANSITIONS || (TRANSITIONS = {}));
export var DRAWER_SIDE;
(function (DRAWER_SIDE) {
    DRAWER_SIDE["Left"] = "LEFT";
    DRAWER_SIDE["Right"] = "RIGHT";
    DRAWER_SIDE["Top"] = "TOP";
    DRAWER_SIDE["Bottom"] = "BOTTOM";
})(DRAWER_SIDE || (DRAWER_SIDE = {}));
export var CHECKBOX;
(function (CHECKBOX) {
    CHECKBOX["Default"] = "DEFAULT";
    CHECKBOX["Switch"] = "SWITCH";
})(CHECKBOX || (CHECKBOX = {}));
export var RADIO;
(function (RADIO) {
    RADIO["Default"] = "DEFAULT";
    RADIO["Card"] = "CARD";
})(RADIO || (RADIO = {}));
export var EDIT_TYPE;
(function (EDIT_TYPE) {
    EDIT_TYPE["Slider"] = "SLIDER";
    EDIT_TYPE["Checkbox"] = "CHECKBOX";
})(EDIT_TYPE || (EDIT_TYPE = {}));
export var DATATYPE;
(function (DATATYPE) {
    DATATYPE["String"] = "STRING";
    DATATYPE["Number"] = "NUMBER";
    DATATYPE["Boolean"] = "BOOLEAN";
    DATATYPE["Array"] = "ARRAY";
    DATATYPE["Object"] = "OBJECT";
    DATATYPE["Date"] = "DATE";
    DATATYPE["Time"] = "TIME";
    DATATYPE["DateTime"] = "DATETIME";
    DATATYPE["File"] = "FILE";
})(DATATYPE || (DATATYPE = {}));
export var SORT;
(function (SORT) {
    SORT["Asc"] = "ASC";
    SORT["Desc"] = "DESC";
})(SORT || (SORT = {}));
export var PROGRESS;
(function (PROGRESS) {
    PROGRESS["Bar"] = "BAR";
    PROGRESS["Ring"] = "RING";
})(PROGRESS || (PROGRESS = {}));
export var SKELETON;
(function (SKELETON) {
    SKELETON["Default"] = "DEFAULT";
    SKELETON["Circle"] = "CIRCLE";
})(SKELETON || (SKELETON = {}));
export var ALERT;
(function (ALERT) {
    ALERT["Success"] = "success";
    ALERT["Error"] = "error";
    ALERT["Warning"] = "warning";
    ALERT["Info"] = "info";
})(ALERT || (ALERT = {}));
export var AVATAR;
(function (AVATAR) {
    AVATAR["Circle"] = "CIRCLE";
    AVATAR["Square"] = "SQUARE";
})(AVATAR || (AVATAR = {}));
export var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["Backspace"] = 8] = "Backspace";
    KeyCode[KeyCode["Tab"] = 9] = "Tab";
    KeyCode[KeyCode["Enter"] = 13] = "Enter";
    KeyCode[KeyCode["Shift"] = 16] = "Shift";
    KeyCode[KeyCode["Ctrl"] = 17] = "Ctrl";
    KeyCode[KeyCode["Alt"] = 18] = "Alt";
    KeyCode[KeyCode["PauseBreak"] = 19] = "PauseBreak";
    KeyCode[KeyCode["CapsLock"] = 20] = "CapsLock";
    KeyCode[KeyCode["Escape"] = 27] = "Escape";
    KeyCode[KeyCode["Space"] = 32] = "Space";
    KeyCode[KeyCode["PageUp"] = 33] = "PageUp";
    KeyCode[KeyCode["PageDown"] = 34] = "PageDown";
    KeyCode[KeyCode["End"] = 35] = "End";
    KeyCode[KeyCode["Home"] = 36] = "Home";
    KeyCode[KeyCode["ArrowLeft"] = 37] = "ArrowLeft";
    KeyCode[KeyCode["ArrowUp"] = 38] = "ArrowUp";
    KeyCode[KeyCode["ArrowRight"] = 39] = "ArrowRight";
    KeyCode[KeyCode["ArrowDown"] = 40] = "ArrowDown";
    KeyCode[KeyCode["Insert"] = 45] = "Insert";
    KeyCode[KeyCode["Delete"] = 46] = "Delete";
    // Number keys
    KeyCode[KeyCode["Digit0"] = 48] = "Digit0";
    KeyCode[KeyCode["Digit1"] = 49] = "Digit1";
    KeyCode[KeyCode["Digit2"] = 50] = "Digit2";
    KeyCode[KeyCode["Digit3"] = 51] = "Digit3";
    KeyCode[KeyCode["Digit4"] = 52] = "Digit4";
    KeyCode[KeyCode["Digit5"] = 53] = "Digit5";
    KeyCode[KeyCode["Digit6"] = 54] = "Digit6";
    KeyCode[KeyCode["Digit7"] = 55] = "Digit7";
    KeyCode[KeyCode["Digit8"] = 56] = "Digit8";
    KeyCode[KeyCode["Digit9"] = 57] = "Digit9";
    // Letter keys
    KeyCode[KeyCode["KeyA"] = 65] = "KeyA";
    KeyCode[KeyCode["KeyB"] = 66] = "KeyB";
    KeyCode[KeyCode["KeyC"] = 67] = "KeyC";
    KeyCode[KeyCode["KeyD"] = 68] = "KeyD";
    KeyCode[KeyCode["KeyE"] = 69] = "KeyE";
    KeyCode[KeyCode["KeyF"] = 70] = "KeyF";
    KeyCode[KeyCode["KeyG"] = 71] = "KeyG";
    KeyCode[KeyCode["KeyH"] = 72] = "KeyH";
    KeyCode[KeyCode["KeyI"] = 73] = "KeyI";
    KeyCode[KeyCode["KeyJ"] = 74] = "KeyJ";
    KeyCode[KeyCode["KeyK"] = 75] = "KeyK";
    KeyCode[KeyCode["KeyL"] = 76] = "KeyL";
    KeyCode[KeyCode["KeyM"] = 77] = "KeyM";
    KeyCode[KeyCode["KeyN"] = 78] = "KeyN";
    KeyCode[KeyCode["KeyO"] = 79] = "KeyO";
    KeyCode[KeyCode["KeyP"] = 80] = "KeyP";
    KeyCode[KeyCode["KeyQ"] = 81] = "KeyQ";
    KeyCode[KeyCode["KeyR"] = 82] = "KeyR";
    KeyCode[KeyCode["KeyS"] = 83] = "KeyS";
    KeyCode[KeyCode["KeyT"] = 84] = "KeyT";
    KeyCode[KeyCode["KeyU"] = 85] = "KeyU";
    KeyCode[KeyCode["KeyV"] = 86] = "KeyV";
    KeyCode[KeyCode["KeyW"] = 87] = "KeyW";
    KeyCode[KeyCode["KeyX"] = 88] = "KeyX";
    KeyCode[KeyCode["KeyY"] = 89] = "KeyY";
    KeyCode[KeyCode["KeyZ"] = 90] = "KeyZ";
    // Numpad keys
    KeyCode[KeyCode["Numpad0"] = 96] = "Numpad0";
    KeyCode[KeyCode["Numpad1"] = 97] = "Numpad1";
    KeyCode[KeyCode["Numpad2"] = 98] = "Numpad2";
    KeyCode[KeyCode["Numpad3"] = 99] = "Numpad3";
    KeyCode[KeyCode["Numpad4"] = 100] = "Numpad4";
    KeyCode[KeyCode["Numpad5"] = 101] = "Numpad5";
    KeyCode[KeyCode["Numpad6"] = 102] = "Numpad6";
    KeyCode[KeyCode["Numpad7"] = 103] = "Numpad7";
    KeyCode[KeyCode["Numpad8"] = 104] = "Numpad8";
    KeyCode[KeyCode["Numpad9"] = 105] = "Numpad9";
    KeyCode[KeyCode["NumpadMultiply"] = 106] = "NumpadMultiply";
    KeyCode[KeyCode["NumpadAdd"] = 107] = "NumpadAdd";
    KeyCode[KeyCode["NumpadSubtract"] = 109] = "NumpadSubtract";
    KeyCode[KeyCode["NumpadDecimal"] = 110] = "NumpadDecimal";
    KeyCode[KeyCode["NumpadDivide"] = 111] = "NumpadDivide";
    // Function keys
    KeyCode[KeyCode["F1"] = 112] = "F1";
    KeyCode[KeyCode["F2"] = 113] = "F2";
    KeyCode[KeyCode["F3"] = 114] = "F3";
    KeyCode[KeyCode["F4"] = 115] = "F4";
    KeyCode[KeyCode["F5"] = 116] = "F5";
    KeyCode[KeyCode["F6"] = 117] = "F6";
    KeyCode[KeyCode["F7"] = 118] = "F7";
    KeyCode[KeyCode["F8"] = 119] = "F8";
    KeyCode[KeyCode["F9"] = 120] = "F9";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["F11"] = 122] = "F11";
    KeyCode[KeyCode["F12"] = 123] = "F12";
    // Other keys
    KeyCode[KeyCode["NumLock"] = 144] = "NumLock";
    KeyCode[KeyCode["ScrollLock"] = 145] = "ScrollLock";
    KeyCode[KeyCode["Semicolon"] = 186] = "Semicolon";
    KeyCode[KeyCode["Equal"] = 187] = "Equal";
    KeyCode[KeyCode["Comma"] = 188] = "Comma";
    KeyCode[KeyCode["Minus"] = 189] = "Minus";
    KeyCode[KeyCode["Period"] = 190] = "Period";
    KeyCode[KeyCode["Slash"] = 191] = "Slash";
    KeyCode[KeyCode["Backquote"] = 192] = "Backquote";
    KeyCode[KeyCode["BracketLeft"] = 219] = "BracketLeft";
    KeyCode[KeyCode["Backslash"] = 220] = "Backslash";
    KeyCode[KeyCode["BracketRight"] = 221] = "BracketRight";
    KeyCode[KeyCode["Quote"] = 222] = "Quote";
})(KeyCode || (KeyCode = {}));
export var SHIMMER;
(function (SHIMMER) {
    SHIMMER["Classic"] = "CLASSIC";
    SHIMMER["Aurora"] = "AURORA";
    SHIMMER["Flame"] = "FLAME";
})(SHIMMER || (SHIMMER = {}));
export var DRAG_DIRECTION;
(function (DRAG_DIRECTION) {
    DRAG_DIRECTION["x"] = "x";
    DRAG_DIRECTION["y"] = "y";
    DRAG_DIRECTION["xy"] = "xy";
})(DRAG_DIRECTION || (DRAG_DIRECTION = {}));
export var Size;
(function (Size) {
    Size["Default"] = "def";
    Size["Small"] = "sm";
    Size["Medium"] = "md";
    Size["Large"] = "lg";
})(Size || (Size = {}));
export var Position;
(function (Position) {
    Position["Auto"] = "auto";
    Position["Top"] = "top";
    Position["Bottom"] = "bottom";
    Position["Left"] = "left";
    Position["Right"] = "right";
})(Position || (Position = {}));
