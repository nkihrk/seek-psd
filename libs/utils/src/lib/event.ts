export function addEventListeners(
  $eventList: string[],
  $element: Window | Document | HTMLElement,
  $callback: (e) => void
): void {
  for (let i = 0; i < $eventList.length; i++) {
    $element.addEventListener($eventList[i], (e) => $callback(e), false);
  }
}

export function requestRender($callback: () => void): void {
  const r: FrameRequestCallback = () => {
    $callback();

    requestAnimationFrame(r);
  };
  requestAnimationFrame(r);
}
