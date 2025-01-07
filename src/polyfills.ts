interface WindowWithGlobal extends Window {
  global?: Window;
}
if (typeof (window as unknown as WindowWithGlobal).global === "undefined") {
  (window as unknown as WindowWithGlobal).global = window;
}
