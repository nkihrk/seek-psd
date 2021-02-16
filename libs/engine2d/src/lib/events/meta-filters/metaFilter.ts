export abstract class MetaFilter {
  abstract get flags(): any;
  abstract get values(): any;
  abstract init($event: PointerEvent): void;
}
