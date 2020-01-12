import { ModuleRef } from '@nestjs/core';
import { TypeHandler } from './types';
import { ICommand } from './interfaces/commands/command.interface';
import { IEvent } from './interfaces/events/event.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';
import { IEventDto } from './interfaces/events/event-dto.interface';
import { IBusAdapter, IOnInitAdapter } from './interfaces/bus/bus-adapter.interface';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { CONFIG_PROVIDER_TOKEN } from './config/constants.config';
import { HandlerTypes } from './enums/handler-types.enum';

// TODO: implement adapter steps
export abstract class Bus {

  protected adapter: IBusAdapter;

  protected readonly configProvider: MicroserviceOptions[]

  constructor(protected readonly moduleRef: ModuleRef) {
    this.configProvider = this.moduleRef.get(CONFIG_PROVIDER_TOKEN);
  }

  abstract publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): any;

  protected abstract registerHandlers(): void;

  protected abstract reflectName(handler: TypeHandler): FunctionConstructor;

  protected abstract get getHandlerTypeType(): HandlerTypes;

  async init(): Promise<void> {
    await this.resolveAdapter();
    await this.registerHandlers();
  }

  protected async resolveAdapter(): Promise<void> {
    const adapterConfig = this.configProvider.find(config => [this.getHandlerTypeType, HandlerTypes.ALL].includes(config.type));

    if (!adapterConfig) {
      // TODO: create an exception class
      throw new Error(`The Bus Adapter was not configure for the ${this.getHandlerTypeType}.`);
    }

    // TODO: figure out the best way to set the adapter
    this.adapter = adapterConfig.adapter;

    // TODO: figure out what is the best way
    if (typeof this.adapter[IOnInitAdapter] === 'function') {
      await this.adapter[IOnInitAdapter]();
    }

  }

  protected registerHandler = (handler: TypeHandler): void => {
    const instance: TypeHandler = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      return;
    }

    const target = this.reflectName(handler);
    const targetInstance = new target(<any>{ name: 'Teo' }, 'ce8e1bc8-c053-4d83-b504-c5b9aeaf8d23');

    this.adapter.subscribe(instance, <any>targetInstance);
  };

}
