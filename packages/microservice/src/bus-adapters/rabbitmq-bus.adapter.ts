import { rabbitmqCreateBus as createBus, IBus } from '@addapptables/bus';
import { IBusAdapter, IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';
import { ICommand } from '../interfaces/commands/command.interface';
import { ICommandDto } from '../interfaces/commands/command-dto-interface';
import { IEvent } from '../interfaces/events/event.interface';
import { IEventDto } from '../interfaces/events/event-dto.interface';
import { mapSeries } from 'bluebird';

export class RabbitMQBusAdapter implements IBusAdapter, IOnInitAdapter {
  private bus: IBus;

  constructor(public readonly options: any) { }


  async onInit(): Promise<void> {
    this.bus = await createBus(this.options);
  }

  publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): any {
    const { action, context } = data;

    return this.bus.publish(action, data, context);
  }

  async subscribe(handler: any, metadata?: any): Promise<void> {
    const handle = (msg, ack, nack) => {
      // TODO: this should be validate appropriately
      try {
        handler.handle(JSON.parse(msg.content.toString()));
        ack();
      } catch (error) {
        ack();
      }
    };

    this.bus.subscribe(metadata.action, handle, metadata.context);
  }

  async subscribeAll(handle: Function, metadata: any[]): Promise<void> {
    const connection = this.bus.getConnection();
    const queue = `${this.options.service}.${this.options.exchange}.saga-${process.pid}`;
    const subChannel = await connection.createChannel();

    await subChannel.assertQueue(queue, {
      autoDelete: true,
      durable: true,
      messageTtl: 60000,
      deadLetterExchange: this.options.exchange,
      deadLetterRoutingKey: 'saga-errors',
    });

    const internalHandle = (subChannel) => (message: any) => {
      // TODO: this should be validate appropriately
      try {
        handle(JSON.parse(message.content.toString()));
        subChannel.ack(message);
      } catch (error) {
        subChannel.nack({ message: error.message }, false, false);
      }
    };

    await mapSeries(metadata, ({ action, context }) => subChannel.bindQueue(queue, context, action));
    await subChannel.consume(queue, internalHandle(subChannel));
  }

}
