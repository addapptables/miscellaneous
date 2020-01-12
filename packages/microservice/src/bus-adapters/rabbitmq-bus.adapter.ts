import { rabbitmqCreateBus as createBus } from '@kerthin/bus';
import { IBusAdapter, IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';
import { ICommand } from '../interfaces/commands/command.interface';
import { ICommandDto } from '../interfaces/commands/command-dto-interface';
import { IEvent } from '../interfaces/events/event.interface';
import { IEventDto } from '../interfaces/events/event-dto.interface';
import { Handler } from '../types';

export class RabbitMQBusAdapter implements IBusAdapter, IOnInitAdapter {
  private bus: any;
  private handlers: Map<string, Handler> = new Map<string, Handler>();

  constructor(
    private readonly exchange: string,
    private readonly host: string,
    private readonly service: string
  ) { }

  setHandlers(handlers: Map<string, Handler>): this {
    this.handlers = handlers;
    return this;
  }

  async onInit(): Promise<void> {
    const exchange = this.exchange;
    const host = this.host;
    const service = this.service;

    this.bus = await createBus({ exchange, host, service });

    this.handlers.forEach(this.subscribe.bind(this));
  }

  publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): any {
    const { action, context } = data;

    return this.bus.publish(action, data, context);
  }

  subscribe(handler: any, metadata?: any): void {
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
