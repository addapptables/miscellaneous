import { rabbitmqCreateBus as createBus, IBus } from '@addapptables/bus';
import { mapSeries } from 'bluebird';
import { IBusAdapter, IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';
import { ICommand } from '../interfaces/commands/command.interface';
import { ICommandDto } from '../interfaces/commands/command-dto-interface';
import { IEvent } from '../interfaces/events/event.interface';
import { IEventDto } from '../interfaces/events/event-dto.interface';

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

  async subscribe(handle: Function, metadata?: any, options?: any): Promise<void> {
    const internalHandle = (msg, ack, nack) => {
      // TODO: this should be validate appropriately
      try {
        handle(JSON.parse(msg.content.toString()));
        ack();
      } catch (error) {
        console.log('error', error);
        nack();
      }
    };

    this.bus.subscribe(metadata.action, internalHandle, metadata.context, options);
  }

}
