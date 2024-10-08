import { useState, useEffect } from 'react';
const useWindowFocus = (delay = 100) => {
    const [focused, setFocus] = useState(true);
    useEffect(() => {
        window.addEventListener(`focusin`, () => setFocus(true));
        window.addEventListener(`focusout`, () => setFocus(false));
        return () => setFocus(false);
    }, [delay]);
    return focused;
};
export default useWindowFocus;
