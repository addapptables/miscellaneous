import { Options } from 'amqplib';

export interface IPublisherRabbitMQOption {
    exchange?: Options.AssertExchange;
    publish?: Options.Publish;
}
