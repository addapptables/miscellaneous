import { EVENT_HANDLER_METADATA } from '../config/constants.config';
import { IEventDto } from '../interfaces';
import { Event } from '../';
import { Type } from '@nestjs/common';

export function EventHandler<T extends Type<Event<IEventDto>>>(event: T): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target);
    };
}
