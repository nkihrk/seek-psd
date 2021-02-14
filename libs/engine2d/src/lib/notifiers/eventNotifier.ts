import { BehaviorSubject, NextObserver, Observable } from 'rxjs';

export class EventNotifier {
  private _eventType: string;
  private notifyEvent = new BehaviorSubject({});

  constructor() {}

  get eventType(): string {
    return this._eventType;
  }

  set eventType($eventType: string) {
    this._eventType = $eventType;
  }

  update($event: any): void {
    this.notifyEvent.next($event);
  }

  get(): any {
    return this.notifyEvent.getValue();
  }

  observer(): Observable<any> {
    const observable = new Observable<any>((observer: NextObserver<any>) => {
      this.notifyEvent.subscribe((e) => {
        observer.next({ eventType: this.eventType, e });
      });
    });

    return observable;
  }
}
