export interface Event {
    event: String | Symbol;
    listeners: (() => void)[];
}

class Events {

    _events: Event[];

    constructor(){

        this._events = []; 
    }

    addEvent(event: String | Symbol, fun: (...args: any[]) => void){
        const evt = this._events.find(x => x.event == event)
        if ( !evt ){
            return this._events.push({event: event, listeners: [fun]})
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

    on(event: String | Symbol, fun: (...args: any[]) => void){
        return this.addEvent(event, fun)
    }

    off(event: String | Symbol, fun: (...args: any[]) => void){
        this.removeEvent(event, fun)
    }

    emit(event: String | Symbol, ...args: any[]){
        const self = this
        const evt = this._events.find(x => x.event == event)
        if ( evt ){
            evt.listeners.forEach((f : (...args: any[]) => void) => {
                try{
                    f.apply(self, args)
                }catch(e){

                }
            })
        }
    }

}

export default Events