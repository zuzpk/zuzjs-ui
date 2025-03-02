/**
 * Custom hook that sets a mounted state to true after a specified delay.
 *
 * @param {number} [delay=100] - The delay in milliseconds before setting the mounted state to true.
 * @returns {boolean} - The mounted state.
 *
 * @example
 * const isMounted = useMounted(200);
 *
 * useEffect(() => {
 *   if (isMounted) {
 *     // Component is mounted after 200ms
 *   }
 * }, [isMounted]);
 */
declare const useMounted: (delay?: number) => boolean;
export default useMounted;
