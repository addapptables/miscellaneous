import { rabbitmqCreateBus as createBus, IBus } from '@addapptables/bus';
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

  subscribe(handler: any, metadata?: any): void {
    console.log('metadata', metadata);

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

}
