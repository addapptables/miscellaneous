import { IEvent } from './interfaces/events/event.interface';
import { IEventDto } from './interfaces/events/event-dto.interface';

export class Event<T extends IEventDto> implements IEvent<T> {
    context: string;
    action: string;

    constructor(
        readonly data: T,
        readonly cid?: string
    ) { }
}
