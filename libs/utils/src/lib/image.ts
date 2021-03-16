export function createImage(
  $blob: Blob | string,
  $callback: ($img: HTMLImageElement) => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = $blob instanceof Blob ? URL.createObjectURL($blob) : $blob;
  img.onload = () => {
    $callback(img);
    if ($blob instanceof Blob) URL.revokeObjectURL(img.src);
  };
  img.onerror = () => {
    throw new Error('Could not load an image');
  };

  return img;
}

export function createDecodedImage(
  $blob: Blob | string,
  $callback?: ($img: HTMLImageElement) => void
): HTMLImageElement {
  const img: HTMLImageElement = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = $blob instanceof Blob ? URL.createObjectURL($blob) : $blob;
  img
    .decode()
    .then(() => {
      if ($callback) $callback(img);
      if ($blob instanceof Blob) URL.revokeObjectURL(img.src);
      //console.log('isBlob : ', $blob instanceof Blob);
    })
    .catch(() => {
      throw new Error('Could not load/decode an image.');
    });

  return img;
}
