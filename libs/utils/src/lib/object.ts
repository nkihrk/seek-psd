// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasProperty(obj: any, key: string): boolean {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}
