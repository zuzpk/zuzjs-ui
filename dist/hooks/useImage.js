import { useEffect, useRef, useState } from "react";
const useImage = (url, crossOrigin, referrerPolicy) => {
    const img = useRef(null);
    const [state, setState] = useState({ loaded: false, error: null });
    useEffect(() => {
        if (url) {
            var _img = new Image();
            crossOrigin && (_img.crossOrigin = crossOrigin);
            referrerPolicy && (_img.referrerPolicy = referrerPolicy);
            _img.onload = () => {
                img.current = _img;
                setState({ loaded: true, error: null });
            };
            _img.onerror = () => {
                setState({ loaded: false, error: `Failed to load image at ${url}` });
            };
            _img.src = url;
        }
    }, []);
    return [img.current ? img.current.src : ``, state.loaded, state.error];
};
export default useImage;
