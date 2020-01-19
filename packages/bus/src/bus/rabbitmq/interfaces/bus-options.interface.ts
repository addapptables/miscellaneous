import { IPublisherRabbitMQOption } from './publisher-option.interface';
import { ISubscriberRabbitMQOption } from './subscriber-option.interface';

export interface IBusRabbitMQOptions {
    exchange: string; // TODO: this should named context in order to be more generic that exchange
    host: string;
    service: string;
    publish?: IPublisherRabbitMQOption;
    subscribe?: ISubscriberRabbitMQOption;
}
