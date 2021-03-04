import { BehaviorSubject, NextObserver, Observable } from 'rxjs';

export interface NotifiedEvent {
  type: string;
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// T is defined as a type of the content
export class Notifier<T> {
  private _notifyType: string;
  private notifyEvent = new BehaviorSubject({} as T);

  constructor() {}

  get notifyType(): string {
    return this._notifyType;
  }

  set notifyType($notifyType: string) {
    this._notifyType = $notifyType;
  }

  update($result: T): void {
    this.notifyEvent.next($result);
  }

  getValue(): T {
    return this.notifyEvent.getValue();
  }

  observer(): Observable<NotifiedEvent> {
    const observable = new Observable<NotifiedEvent>(
      (observer: NextObserver<NotifiedEvent>) => {
        this.notifyEvent.subscribe((e: T) => {
          observer.next({ type: this.notifyType, content: e });
        });
      }
    );

    return observable;
  }
}
