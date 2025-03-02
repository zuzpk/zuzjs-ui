class Events {
    _events;
    constructor() {
        this._events = [];
    }
    addEvent(event, fun, context) {
        const evt = this._events.find(x => x.event == event);
        const listener = { fun: context ? fun.bind(context) : fun, context };
        if (!evt) {
            return this._events.push({ event: event, listeners: [listener] });
        }
        if (!evt.listeners.find(x => x.fun == fun)) {
            evt.listeners.push(listener);
        }
    }
    removeEvent(event, fun) {
        const evt = this._events.find(x => x.event == event);
        if (evt) {
            evt.listeners = evt.listeners.filter(x => x.fun != fun);
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
            // console.log(evt)
            evt.listeners.forEach(({ fun, context }) => {
                try {
                    // f(args)
                    fun.apply(context, args);
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
}
export default Events;
