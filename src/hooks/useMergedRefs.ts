import { RefObject, useCallback } from "react";

const useMergedRefs = <T>(...refs: (React.Ref<T> | undefined)[]) => {
  return useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") ref(node);
        else if ("current" in ref) (ref as RefObject<T>).current = node;
      });
    },
    [refs]
  );
}

export default useMergedRefs