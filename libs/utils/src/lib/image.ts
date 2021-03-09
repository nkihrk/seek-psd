export function createImage(
  $blob: Blob,
  $callback: ($img: HTMLImageElement) => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = URL.createObjectURL($blob);
  img.onload = () => {
    $callback(img);
    URL.revokeObjectURL(img.src);
  };

  return img;
}
