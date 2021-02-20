import { BehaviorSubject, NextObserver, Observable } from 'rxjs';

export interface NotifiedEvent {
  type: string;
  event: FilterResult;
}

export interface FilterResult {
  flags: any;
  values: any;
  eventType: string;
  default: any;
}

export class EventNotifier {
  private _eventType: string;
  private notifyEvent = new BehaviorSubject({} as FilterResult);

  constructor() {}

  get eventType(): string {
    return this._eventType;
  }

  set eventType($eventType: string) {
    this._eventType = $eventType;
  }

  update($event: FilterResult): void {
    this.notifyEvent.next($event);
  }

  getValue(): FilterResult {
    return this.notifyEvent.getValue();
  }

  observer(): Observable<NotifiedEvent> {
    const observable = new Observable<NotifiedEvent>(
      (observer: NextObserver<NotifiedEvent>) => {
        this.notifyEvent.subscribe((e: FilterResult) => {
          observer.next({ type: this.eventType, event: e });
        });
      }
    );

    return observable;
  }
}
