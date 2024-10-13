import { useEffect } from "react";
import Events from "../funs/events";
const events = new Events();
const useSub = (event, fun, context) => {
    const unsubscribe = () => {
        events.off(event, fun);
    };
    useEffect(() => {
        events.on(event, fun, context);
        return;
    }, []);
    return unsubscribe;
};
const usePub = () => {
    return (event) => {
        events.emit(event);
    };
};
export { useSub, usePub };
