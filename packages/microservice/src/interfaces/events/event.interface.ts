import { IEventDto } from './event-dto.interface';

export interface IEvent<T extends IEventDto> {
    context: string;
    action: string;
    data: T;
    cid?: string;
}
