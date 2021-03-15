export function removePathFromName($fileName: string): string {
  return $fileName.split('/').slice(-1).pop();
}

export function getExtensionFromName($fileName: string): string {
  return $fileName.split('.').slice(-1).pop().toLowerCase();
}
