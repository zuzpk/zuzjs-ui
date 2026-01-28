import { useCallback, useEffect, useRef } from "react"; // Added useRef for internal state if needed
import { Direction } from "../types"; // Assuming Direction is 'top' | 'bottom' | 'left' | 'right'

interface PositionOptions {
  offset?: number;
  direction?: Direction;
  container?: HTMLElement | null; // Optional bounding parent, treated as the element's positioning context
  // Optional: A separate trigger element if it's not the parent of `ref.current`
  triggerRef?: React.RefObject<HTMLElement>;
}

export const usePosition = (
  ref: React.RefObject<HTMLElement>, // The element to be positioned
  options: PositionOptions = {}
) => {
  const {
    offset = 8,
    direction = 'bottom',
    container = null, // Can be a specific parent container
    triggerRef = null, // If the trigger is not the immediate parent
  } = options;

  // Internal state to store the applied position type
  const appliedPositionRef = useRef<'absolute' | 'fixed' | null>(null);

  const calculate = useCallback(() => {

    const el = ref.current;
    if (!el) return;

    // Determine the trigger element
    const trigger = triggerRef?.current || el.parentElement;
    if (!trigger) {
      console.warn("usePosition: No trigger element found. Positioning may not work.");
      return;
    }

      const rect = el.getBoundingClientRect(); // Bounding rect of the element to position
      const triggerRect = trigger.getBoundingClientRect(); // Bounding rect of the trigger

      // --- Determine the effective positioning context ---
      let parentRect;
      let targetPosition: 'absolute' | 'fixed';

      if (container) {
        // If a specific container is provided, we assume 'absolute' positioning relative to it
        // The container MUST be positioned (relative, absolute, fixed, sticky) for this to work correctly.
        parentRect = container.getBoundingClientRect();
        targetPosition = 'absolute';
      } else {
        // No specific container provided. We need to decide if fixed or absolute to the viewport/document.

        // Heuristic: If the trigger itself (or its ancestors) has 'fixed' position,
        // or if the trigger is very close to the viewport edge,
        // and/or if we want the positioned element to stay visible during scroll,
        // we might prefer 'fixed'. Otherwise, 'absolute' is the default.

        // A simple check: if the element is meant to stay in view regardless of scroll, 'fixed' is better.
        // Otherwise, if it should scroll with the document, 'absolute' relative to the document.

        // Let's default to 'fixed' for viewport-relative behavior if no container is provided,
        // as this is often desired for elements like tooltips/dropdowns that follow the viewport.
        // If the user *wants* it to scroll with content when no explicit container, they should set
        // `position: absolute` and its parent *will* determine its containing block.

        // For automatic calculation *without* explicitly setting parent position:
        // If the `el`'s *computed* position is already `fixed`, keep it `fixed`.
        // Otherwise, we will explicitly set it to `absolute` and position relative to the document.

        const computedElStyle = window.getComputedStyle(el);
        if (computedElStyle.position === 'fixed') {
          targetPosition = 'fixed';
        } else {
          // If not fixed, we will try to make it absolute relative to the document body
          // (which effectively means relative to the viewport if no parent is positioned).
          // We'll set el.style.position = 'absolute'
          targetPosition = 'absolute';
        }

        // For 'fixed' positioning, the parentRect is the viewport
        if (targetPosition === 'fixed') {
          parentRect = {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        } else { // targetPosition === 'absolute'
          // For 'absolute' positioning without a specified container,
          // it implicitly positions relative to the initial containing block (viewport/document).
          // So, the coordinates will still be viewport-relative.
          // We need to ensure 'el' is actually positioned absolute.
          parentRect = {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        }
      }

      // Apply the determined position style if it's different from current
      if (el.style.position !== targetPosition) {
        el.style.position = targetPosition;
        appliedPositionRef.current = targetPosition; // Store what we applied
      } else {
        appliedPositionRef.current = targetPosition; // Confirm current state
      }

      let top = 0;
      let left = 0;

      // Calculate position relative to the viewport for initial placement
      // These are always viewport coordinates, even if `targetPosition` becomes `absolute`
      // We'll adjust based on `targetPosition` when applying to `el.style`
      let viewportTop = 0;
      let viewportLeft = 0;

      // Determine base top/left by direction
      switch (direction) {
        case 'top':
          viewportTop = triggerRect.top - rect.height - offset;
          viewportLeft = triggerRect.left;
          // Flipping logic (if it goes off-screen in the current direction)
          if (viewportTop < parentRect.top && triggerRect.bottom + rect.height + offset <= parentRect.bottom) {
              viewportTop = triggerRect.bottom + offset;
          }
          break;

        case 'bottom':
          viewportTop = triggerRect.bottom + offset;
          viewportLeft = triggerRect.left;
          // Flipping logic
          if (viewportTop + rect.height > parentRect.bottom && triggerRect.top - rect.height - offset >= parentRect.top) {
              viewportTop = triggerRect.top - rect.height - offset;
          }
          break;

        case 'left':
          viewportTop = triggerRect.top;
          viewportLeft = triggerRect.left - rect.width - offset;
          // Flipping logic
          if (viewportLeft < parentRect.left && triggerRect.right + rect.width + offset <= parentRect.right) {
              viewportLeft = triggerRect.right + offset;
          }
          break;

        case 'right':
          viewportTop = triggerRect.top;
          viewportLeft = triggerRect.right + offset;
          // Flipping logic
          if (viewportLeft + rect.width > parentRect.right && triggerRect.left - rect.width - offset >= parentRect.left) {
              viewportLeft = triggerRect.left - rect.width - offset;
          }
          break;
      }

      // Clamp to parent/viewport boundaries *after* potential flipping
      viewportTop = Math.max(parentRect.top, Math.min(viewportTop, parentRect.bottom - rect.height));
      viewportLeft = Math.max(parentRect.left, Math.min(viewportLeft, parentRect.right - rect.width));

      // Apply coordinates based on the determined `targetPosition`
      if (appliedPositionRef.current === 'fixed') {
        // If fixed, apply viewport coordinates directly
        el.style.top = `${viewportTop}px`;
        el.style.left = `${viewportLeft}px`;
      } else { // 'absolute'
        // If absolute, coordinates need to be relative to the closest positioned ancestor (offsetParent)
        // If there's no positioned ancestor, offsetParent is body/html, so it's effectively viewport relative
        // If there *is* a positioned ancestor, we need to subtract its position.

        // Get the actual offset parent's bounding rect
        let offsetParentRect;
        if (el.offsetParent) {
          offsetParentRect = el.offsetParent.getBoundingClientRect();
        } else {
          // If no offsetParent, it implies relative to initial containing block (viewport)
          offsetParentRect = { top: 0, left: 0 };
        }

        // Calculate relative coordinates
        const finalTop = viewportTop - offsetParentRect.top + window.scrollY; // Add scrollY for document-relative `top`
        const finalLeft = viewportLeft - offsetParentRect.left + window.scrollX; // Add scrollX for document-relative `left`

        el.style.top = `${finalTop}px`;
        el.style.left = `${finalLeft}px`;
      }
  }, [ref, triggerRef, offset, direction, container]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Determine the trigger element
    const trigger = triggerRef?.current || el.parentElement;
    if (!trigger) {
      console.warn("usePosition: No trigger element found. Positioning may not work.");
      return;
    }

    // Observers and event listeners
    const observer = new ResizeObserver(calculate);
    observer.observe(el);
    if (trigger) observer.observe(trigger); // Observe trigger for size/position changes

    calculate(); // Initial calculation

    window.addEventListener('resize', calculate);
    window.addEventListener('scroll', calculate, true); // Use capture phase for reliability

    return () => {
      observer.disconnect();
      if (trigger) observer.disconnect(); // Disconnect trigger observer as well
      window.removeEventListener('resize', calculate);
      window.removeEventListener('scroll', calculate, true);
    };
  }, [ref, direction, offset, container, triggerRef]); // Add triggerRef to dependency array

  return { 
    postion: appliedPositionRef.current,
    reposition: calculate
  }
  
};

export default usePosition;