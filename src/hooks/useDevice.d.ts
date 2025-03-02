import { Dimensions } from './useDimensions';
declare const useDevice: () => {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
} & Dimensions;
export default useDevice;
