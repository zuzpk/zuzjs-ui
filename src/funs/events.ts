export interface Event {
    event: String | Symbol;
    listeners: (() => void)[];
    context?: any;   
}

class Events {

    _events: Event[];

    constructor(){

        this._events = []; 
    }

    addEvent(event: String | Symbol, fun: (...args: any[]) => void, context?: any){
        // console.log(`addEvent`, context)
        const evt = this._events.find(x => x.event == event)
        if ( !evt ){
            return this._events.push({event: event, listeners: [fun], context})
        }
        if ( !evt.listeners.find(x => x == fun) ){
            evt.listeners.push(fun)
        }
    }

    removeEvent(event: String | Symbol, fun: (...args: any[]) => void){
        const evt = this._events.find(x => x.event == event)
        if ( evt ){
            evt.listeners = evt.listeners.filter(x => x != fun)
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
            evt.listeners.forEach((f : (...args: any[]) => void) => {
                try{
                    // f(args)
                    f.apply(evt.context || self, args)
                }catch(e){
                    console.error(e);
                }
            })
        }
    }

}

export default Events