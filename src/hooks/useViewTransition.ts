import { useCallback } from "react";

const useViewTransition = () => {
  const startTransition = useCallback((callback: () => void) => {
    if (document.startViewTransition) {
      document.startViewTransition(callback);
    } else {
      callback(); // Fallback for browsers without View Transitions
    }
  }, []);

  return startTransition;
};

export default useViewTransition;