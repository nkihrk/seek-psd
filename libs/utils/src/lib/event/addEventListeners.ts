export function addEventListeners(
  $eventList: string[],
  $element: Window | Document | HTMLCanvasElement,
  $callback: (e) => void
): void {
  for (let i = 0; i < $eventList.length; i++) {
    $element.addEventListener($eventList[i], (e) => $callback(e), false);
  }
}
