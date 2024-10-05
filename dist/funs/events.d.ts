export interface Event {
    event: String | Symbol;
    listeners: (() => void)[];
}
declare class Events {
    _events: Event[];
    constructor();
    addEvent(event: String | Symbol, fun: (...args: any[]) => void): number | undefined;
    removeEvent(event: String | Symbol, fun: (...args: any[]) => void): void;
    on(event: String | Symbol, fun: (...args: any[]) => void): number | undefined;
    off(event: String | Symbol, fun: (...args: any[]) => void): void;
    emit(event: String | Symbol, ...args: any[]): void;
}
export default Events;
