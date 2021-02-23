export class Store {
  private _hi = 'hi';

  constructor() {}

  get hi(): string {
    return this._hi;
  }
}
