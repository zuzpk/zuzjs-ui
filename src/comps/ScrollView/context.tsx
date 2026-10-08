import { createContext, useContext, RefObject } from 'react';

const ScrollViewContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export const ScrollViewProvider = ScrollViewContext.Provider;

export const useScrollView = () => {
    return useContext(ScrollViewContext);
};

export default ScrollViewContext;
