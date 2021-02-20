export abstract class MetaFilter<T, U> {
  private _flags = {} as T;
  private _values = {} as U;

  get flags(): T {
    return this._flags;
  }

  get values(): U {
    return this._values;
  }

  init($event): void {
    this._flags = this.generateFlags($event);
    this._values = this.generateValues($event);
  }

  protected abstract generateFlags($event?): T;
  protected abstract generateValues($event?): U;
}
