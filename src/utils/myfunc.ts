export function debounce<T extends (...args: any[]) => any>(
  func: T,
  that: any,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(that, args); // 直接调用 func，this 是从外部上下文中捕获的
    }, delay);
  };
}
