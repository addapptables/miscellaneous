import { IMessage } from './message.interface';
import * as amqp from 'amqplib';

export type handler = (msg: IMessage, ack: () => void, nack: () => void) => void;

export interface IBus {
    publish(action: string, payload: any, context?: string, opts?: any): Promise<void>;
    subscribe(action: string, handler: handler, context?: string, options?: any): Promise<void>;
    send(queue: string, payload: any, options?: any): Promise<void>;
    close(): void;
    getConnection(): amqp.Connection;
}
