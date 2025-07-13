export const throttle = <T = unknown>(fn: (...args: T[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> = null;

  return (...args: T[]) => {
    if (timeoutId) return;

    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);

    fn(...args);
  };
}