export function removeItem($list: any[], $index: number): any[] {
  return $list.slice(0, $index).concat($list.slice($index + 1, $list.length));
}
