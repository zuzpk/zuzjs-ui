import { useState, useEffect } from 'react';
const useMounted = (delay = 100) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return mounted;
};
export default useMounted;
