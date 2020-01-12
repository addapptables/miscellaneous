import { IPublisherRabbitMQOption } from './publisher-option.interface';
import { ISubscriberRabbitMQOption } from './subscriber-option.interface';

export interface IBusRabbitMQOptions {
    exchange: string;
    host: string;
    service: string;
    publish?: IPublisherRabbitMQOption;
    subscribe?: ISubscriberRabbitMQOption;
}
