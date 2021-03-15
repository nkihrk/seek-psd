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

export function duplicateCanvasElement(
  $canvas: HTMLCanvasElement
): HTMLCanvasElement {
  const c: HTMLCanvasElement = document.createElement('canvas');
  c.width = $canvas.width;
  c.height = $canvas.height;
  const ctx: CanvasRenderingContext2D = c.getContext('2d');
  ctx.drawImage($canvas, 0, 0, c.width, c.height);

  return c;
}
