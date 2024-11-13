export interface Event {
    event: String | Symbol;
    listeners: Array<{ fun: (...args: any[]) => void, context?: any }>;
}

class Events {

    _events: Event[];

    constructor(){

        this._events = []; 
    }

    addEvent(event: String | Symbol, fun: (...args: any[]) => void, context?: any){
        const evt = this._events.find(x => x.event == event)
        const listener = { fun: context ? fun.bind(context) : fun, context }
        if ( !evt ){
            return this._events.push({event: event, listeners: [listener]})
        }
        if ( !evt.listeners.find(x => x.fun == fun) ){
            evt.listeners.push(listener)
        }
    }

    removeEvent(event: String | Symbol, fun: (...args: any[]) => void){
        const evt = this._events.find(x => x.event == event)
        if ( evt ){
            evt.listeners = evt.listeners.filter(x => x.fun != fun)
        }
    }

    on(event: String | Symbol, fun: (...args: any[]) => void, context?: any){
        return this.addEvent(event, fun, context)
    }

    off(event: String | Symbol, fun: (...args: any[]) => void){
        this.removeEvent(event, fun)
    }

    emit(event: String | Symbol, ...args: any[]){
        const evt = this._events.find(x => x.event == event)
        if ( evt ){
            // console.log(evt)
            evt.listeners.forEach(({ fun, context }) => {
                try{
                    // f(args)
                    fun.apply(context, args)
                }catch(e){
                    console.error(e);
                }
            })
        }
    }

}

export default Events