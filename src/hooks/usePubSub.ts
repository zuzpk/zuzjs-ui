import { useEffect } from "react"
import Events from "../funs/events"

const events = new Events()

const useSub = (event: String | Symbol, fun: () => void, context?: any) => {

    const unsubscribe = () => {
        events.off(event, fun)
    }

    useEffect(() => {
        events.on(event, fun, context)
        return 
    }, [])

    return unsubscribe

}

const usePub = () => {
    return (event : String | Symbol) => {
        events.emit(event)
    }
}

export {
    useSub,
    usePub
}