export function validateFormat($fileName: string, $regExp: string): boolean {
  const regex = new RegExp($regExp);
  return regex.test($fileName);
}
