import { ModuleRef } from '@nestjs/core';
import { Class } from './types';
import { IBusAdapter } from './interfaces/bus/bus-adapter.interface';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { MICROSERVICE_CONFIG_PROVIDER } from './config/constants.config';
import { IHandler, IOnInit, OnInit } from './interfaces';
import { BusConfigException } from './exceptions';
import { ITransferData } from './interfaces/transfer-data';
import { TransferDataDto } from './interfaces/transfer-data-dto.interface';

export abstract class Bus implements IOnInit {

  protected adapter: IBusAdapter;

  protected readonly microserviceConfigProvider: MicroserviceOptions

  constructor(protected readonly moduleRef: ModuleRef) {
    this.microserviceConfigProvider = this.moduleRef.get(MICROSERVICE_CONFIG_PROVIDER);
  }

  abstract publish(data: ITransferData<TransferDataDto>): any;

  protected abstract registerHandlers(): void;

  protected abstract reflectName(handler: Class<IHandler>): Class<ITransferData<TransferDataDto>>;

  protected abstract subscribe(handle: IHandler): (data: any) => Promise<any>;

  async onInit(): Promise<void> {
    await this.resolveAdapter();
    await this.registerHandlers();
  }

  protected async resolveAdapter(): Promise<void> {
    const adapterConfig = this.microserviceConfigProvider.adapter;

    if (!adapterConfig) {
      throw new BusConfigException('The Bus Adapter was not configured.');
    }

    const AdapterPrototype = adapterConfig.adapterPrototype;
    this.adapter = new AdapterPrototype(adapterConfig.adapterConfig);

    // TODO: put this in a class
    if (typeof this.adapter[OnInit] === 'function') {
      await this.adapter[OnInit]();
    }
  }

  protected registerHandler = (handler: Class<IHandler>): void => {
    const instance: IHandler = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      return;
    }

    const Target = this.reflectName(handler);
    const data = new Target();

    this.adapter.subscribe(this.subscribe(instance), data);
  };

}
