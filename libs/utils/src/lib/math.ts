interface Coord {
  x: number;
  y: number;
}

export function getCenterCoord($x: Coord, $y: Coord): Coord {
  return { x: ($x.x + $y.x) / 2, y: ($x.y + $y.y) / 2 };
}
