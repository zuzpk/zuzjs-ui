import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import Sheet from "../comps/sheet";
const useToast = () => {
    const sheet = useRef(null);
    useEffect(() => {
    }, []);
    return _jsx(Sheet, { ref: sheet });
};
export default useToast;
