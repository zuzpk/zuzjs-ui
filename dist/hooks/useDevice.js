'use client';
import { useEffect } from 'react';
import useDimensions from './useDimensions';
const useDevice = () => {
    const userAgent = navigator.userAgent;
    const mobile = /Mobi|Android/i.test(userAgent);
    const tablet = /Tablet|iPad/i.test(userAgent);
    const dims = useDimensions();
    useEffect(() => {
    }, []);
    return {
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: !mobile && !tablet,
        ...dims
    };
};
export default useDevice;
