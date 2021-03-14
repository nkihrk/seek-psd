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
  img.onerror = () => {
    throw new Error('Could not load an image');
  };

  return img;
}

export function createDecodedImage(
  $blob: Blob,
  $callback: ($img: HTMLImageElement) => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = URL.createObjectURL($blob);
  img
    .decode()
    .then(() => {
      $callback(img);
      URL.revokeObjectURL(img.src);
    })
    .catch(() => {
      throw new Error('Could not load/decode an image.');
    });

  return img;
}
