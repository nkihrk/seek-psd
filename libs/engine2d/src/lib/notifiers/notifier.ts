import { BehaviorSubject, NextObserver, Observable } from 'rxjs';

export interface NotifiedEvent {
  notifyType: string;
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// T is defined as a type of the content
export class Notifier<T> {
  notifyType: string;

  private notifyEvent = new BehaviorSubject({} as T);

  constructor() {}

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
          observer.next({ notifyType: this.notifyType, content: e });
        });
      }
    );

    return observable;
  }
}
