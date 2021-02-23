export class Store {
  private _test = 'hi';

  constructor() {}

  get test(): string {
    return this._test;
  }
}
