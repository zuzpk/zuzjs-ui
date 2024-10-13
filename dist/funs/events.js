class Events {
    _events;
    constructor() {
        this._events = [];
    }
    addEvent(event, fun, context) {
        const evt = this._events.find(x => x.event == event);
        if (!evt) {
            return this._events.push({ event: event, listeners: [fun], context });
        }
        if (!evt.listeners.find(x => x == fun)) {
            evt.listeners.push(fun);
        }
    }
    removeEvent(event, fun) {
        const evt = this._events.find(x => x.event == event);
        if (evt) {
            evt.listeners = evt.listeners.filter(x => x != fun);
        }
    }
    on(event, fun, context) {
        return this.addEvent(event, fun, context);
    }
    off(event, fun) {
        this.removeEvent(event, fun);
    }
    emit(event, ...args) {
        const evt = this._events.find(x => x.event == event);
        if (evt) {
            evt.listeners.forEach((f) => {
                try {
                    f.apply(evt.context || self, args);
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
}
export default Events;
