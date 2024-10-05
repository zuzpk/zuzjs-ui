class Events {
    _events;
    constructor() {
        this._events = [];
    }
    addEvent(event, fun) {
        const evt = this._events.find(x => x.event == event);
        if (!evt) {
            return this._events.push({ event: event, listeners: [fun] });
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
    on(event, fun) {
        return this.addEvent(event, fun);
    }
    off(event, fun) {
        this.removeEvent(event, fun);
    }
    emit(event, ...args) {
        const self = this;
        const evt = this._events.find(x => x.event == event);
        if (evt) {
            evt.listeners.forEach((f) => {
                try {
                    f.apply(self, args);
                }
                catch (e) {
                }
            });
        }
    }
}
export default Events;
