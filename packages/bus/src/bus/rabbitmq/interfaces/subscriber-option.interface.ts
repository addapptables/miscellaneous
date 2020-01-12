import { Options } from 'amqplib';

export interface ISubscriberRabbitMQOption {
    exchange?: Options.AssertExchange;
    queue?: Options.AssertQueue;
    consume?: Options.Consume;
}
