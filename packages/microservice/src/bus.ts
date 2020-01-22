import { ModuleRef } from '@nestjs/core';
import { TypeHandler } from './types';
import { ICommand } from './interfaces/commands/command.interface';
import { IEvent } from './interfaces/events/event.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';
import { IEventDto } from './interfaces/events/event-dto.interface';
import { IBusAdapter, IOnInitAdapter } from './interfaces/bus/bus-adapter.interface';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { CONFIG_PROVIDER_TOKEN } from './config/constants.config';
import { IHandler } from './interfaces';

// TODO: implement adapter steps
export abstract class Bus {

  protected adapter: IBusAdapter;

  protected readonly configProvider: MicroserviceOptions

  constructor(protected readonly moduleRef: ModuleRef) {
    this.configProvider = this.moduleRef.get(CONFIG_PROVIDER_TOKEN);
  }

  abstract publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): any;

  protected abstract registerHandlers(): void;

  protected abstract reflectName(handler: TypeHandler): FunctionConstructor;

  protected abstract subscribe(handle: IHandler): (data: any) => Promise<any>;

  async init(): Promise<void> {
    await this.resolveAdapter();
    await this.registerHandlers();
  }

  protected async resolveAdapter(): Promise<void> {
    const adapterConfig = this.configProvider.adapter;

    if (!adapterConfig) {
      // TODO: create an exception class
      throw new Error('The Bus Adapter was not configure.');
    }

    // TODO: figure out the best way to set the adapter
    const AdapterPrototype = adapterConfig.adapterPrototype;
    this.adapter = new AdapterPrototype(adapterConfig.adapterConfig);

    // TODO: figure out what is the best way
    if (typeof this.adapter[IOnInitAdapter] === 'function') {
      await this.adapter[IOnInitAdapter]();
    }

  }

  protected registerHandler = (handler: TypeHandler): void => {
    const instance: IHandler = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      return;
    }

    // TODO: create interface generic for ICommand and IEvent
    const target = this.reflectName(handler);
    const metadata = new target();

    this.adapter.subscribe(this.subscribe(instance), <any>metadata);
  };

}
