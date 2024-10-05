import { useEffect } from "react";
import Events from "../funs/events";
const events = new Events();
const useSub = (event, fun) => {
    const unsubscribe = () => {
        events.off(event, fun);
    };
    useEffect(() => {
        events.on(event, fun);
        return;
    }, []);
    return unsubscribe;
};
const usePub = () => {
    return;
};
export { useSub, usePub };
