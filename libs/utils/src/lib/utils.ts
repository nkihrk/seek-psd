import ResizeObserver from 'resize-observer-polyfill';

export async function setPixelPerfect(
  $canvas: HTMLCanvasElement,
  $callback: ($canvas: HTMLCanvasElement) => void
): Promise<void> {
  const observer = new ResizeObserver(() => {
    const cRect: DOMRect = $canvas.getBoundingClientRect();
    const pixelRatio: number = getPixelRatio($canvas.getContext('2d'));
    $canvas.width = cRect.width * pixelRatio;
    $canvas.height = cRect.height * pixelRatio;

    // execute a callback
    $callback($canvas);
  });

  observer.observe($canvas);
}

export function getPixelRatio($ctx: CanvasRenderingContext2D): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = $ctx;
  const dpr: number = window.devicePixelRatio || 1;
  const bsr: number =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
}

export function addEventListeners(
  $eventList: string[],
  $element: Window | Document | HTMLDocument,
  $callback: (e) => void
): void {
  for (let i = 0; i < $eventList.length; i++) {
    $element.addEventListener($eventList[i], (e) => $callback(e), false);
  }
}
