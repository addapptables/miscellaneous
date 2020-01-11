import { IEvent } from './event.interface';
import { IEventDto } from './event-dto.interface';

export interface IEventHandler<T extends IEvent<IEventDto>> {
  handle(event: T): void;
}
