import { rabbitmqCreateBus as createBus, IBus } from '@addapptables/bus';
import { IBusAdapter } from '../interfaces/bus/bus-adapter.interface';
import { IOnInit } from '../interfaces/lifecycles';
import { ITransferData } from '../interfaces/transfer-data';
import { TransferDataDto } from '../interfaces/transfer-data-dto.interface';
import { ISetOptions } from '../interfaces/set-options.interface';

export class RabbitMQBusAdapter implements IBusAdapter, IOnInit, ISetOptions {

  private bus: IBus;

  private options: any = {};

  async onInit(): Promise<void> {
    this.bus = await createBus(this.options);
  }

  publish(data: ITransferData<TransferDataDto>): Promise<void> {
    const { action, context } = data;

    return this.bus.publish(action, data, context);
  }

  async subscribe(handle: Function, data: ITransferData<TransferDataDto>, options?: any): Promise<void> {
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

    this.bus.subscribe(data.action, internalHandle, data.context, options);
  }

  setOptions(options: any): void {
    this.options = options;
  }

  close(): void {
    this.bus.close();
  }

}
