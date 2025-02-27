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

/**
 * utc时间转换为本地时间，用 “-” 代替 “/”
 * @param utcTime UTC时间字符串
 * @returns 本地时间字符串
 */
export function utcToLocal(utcTime: string): string {
  const date = new Date(utcTime);
  const localTime = date.toLocaleString();
  return localTime.replace(/\//g, "-");
}

/**
 * 切换全屏
 * @param element 要切换全屏的元素
 */
export function toggleFullScreen(element: HTMLElement) {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    element.requestFullscreen();
  }
}

export function printOfd(element: HTMLElement) {
  let childs = element.children;
  let list: any[] = [];
  for (let page of childs) {
    list.push(page.cloneNode(true));
  }
  if (list.length > 0) {
    let printWindow: any = window.open("打印窗口", "_blank");
    //给新打开的标签页添加画布内容
    let documentBody = printWindow.document.body;
    // 需要给新打开的标签页添加样式，否则打印出来的内容会很错位
    documentBody.style.marginTop = "20px";
    for (let page of list) {
      // 为了让打印的内容不会太靠上，所以给每一页都添加一个marginBottom
      page.style.marginBottom = "20px";
      documentBody.appendChild(page);
    }
    //焦点移到新打开的标签页
    printWindow.focus();
    //执行打印的方法（注意打印方法是打印的当前窗口内的元素，所以前面才新建一个窗口：print()--打印当前窗口的内容。）
    printWindow.print();
    //操作完成之后关闭当前标签页（点击确定或者取消都会关闭）
    printWindow.close();
  }
}
