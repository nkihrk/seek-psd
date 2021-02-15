import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgMouseEvent extends EgCommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onClick($event: MouseEvent): void {}

  onDblClick($event: MouseEvent): void {}

  onContextmenu($event: MouseEvent): void {}
}
