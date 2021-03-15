import ResizeObserver from 'resize-observer-polyfill';

export function setPixelPerfect(
  $canvas: HTMLCanvasElement,
  $callback: (c: HTMLCanvasElement) => void
): void {
  makePixelPerfect($canvas);

  // execute a callback
  $callback($canvas);
}

export function setPixelPerfectOnResize(
  $canvas: HTMLCanvasElement,
  $callback: (c: HTMLCanvasElement) => void
): void {
  const observer = new ResizeObserver(() => {
    makePixelPerfect($canvas);

    // execute a callback
    $callback($canvas);
  });

  observer.observe($canvas);
}

export function makePixelPerfect($canvas: HTMLCanvasElement): void {
  const cRect: DOMRect = $canvas.getBoundingClientRect();
  const pixelRatio: number = getPixelRatio($canvas.getContext('2d'));
  $canvas.width = cRect.width * pixelRatio;
  $canvas.height = cRect.height * pixelRatio;
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
