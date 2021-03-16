export function createImage(
  $blob: Blob | string,
  $callback?: ($img: HTMLImageElement) => void,
  $onError?: () => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = $blob instanceof Blob ? URL.createObjectURL($blob) : $blob;
  img.onload = () => {
    if ($callback) $callback(img);
    if ($blob instanceof Blob) URL.revokeObjectURL(img.src);
  };

  return img;
}

export function createDecodedImage(
  $blob: Blob | string,
  $callback?: (image: HTMLImageElement) => void,
  $onError?: () => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = $blob instanceof Blob ? URL.createObjectURL($blob) : $blob;
  img
    .decode()
    .then(() => {
      if ($callback) $callback(img);
      if ($blob instanceof Blob) URL.revokeObjectURL(img.src);
    })
    .catch(() => {
      console.error('Could not load/decode an image.');

      if ($onError) $onError();
    });

  return img;
}
