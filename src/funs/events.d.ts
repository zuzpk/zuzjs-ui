export interface Event {
    event: String | Symbol;
    listeners: Array<{
        fun: (...args: any[]) => void;
        context?: any;
    }>;
}
declare class Events {
    _events: Event[];
    constructor();
    addEvent(event: String | Symbol, fun: (...args: any[]) => void, context?: any): number | undefined;
    removeEvent(event: String | Symbol, fun: (...args: any[]) => void): void;
    on(event: String | Symbol, fun: (...args: any[]) => void, context?: any): number | undefined;
    off(event: String | Symbol, fun: (...args: any[]) => void): void;
    emit(event: String | Symbol, ...args: any[]): void;
}
export default Events;
