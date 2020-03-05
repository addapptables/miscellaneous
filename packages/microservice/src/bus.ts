import { ModuleRef } from '@nestjs/core';
import { OnModuleDestroy, Logger } from '@nestjs/common';
import { Class } from './types';
import { IBusAdapter } from './interfaces/bus/bus-adapter.interface';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { MICROSERVICE_CONFIG_PROVIDER } from './config/constants.config';
import { IHandler, IOnInit } from './interfaces';
import { ITransferData } from './interfaces/transfer-data';
import { TransferDataDto } from './interfaces/transfer-data-dto.interface';
import { InitializeAdapterBus } from './services/initialize-adapter-bus.service';

export abstract class Bus implements IOnInit, OnModuleDestroy {

  private readonly logger: Logger;

  protected adapter: IBusAdapter;

  protected readonly microserviceOptions: MicroserviceOptions

  constructor(protected readonly moduleRef: ModuleRef) {
    this.microserviceOptions = this.moduleRef.get(MICROSERVICE_CONFIG_PROVIDER);
    this.logger = new Logger(Bus.name);
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
    const adapterInstance = await (new InitializeAdapterBus(this.microserviceOptions))
      .init(this.microserviceOptions.adapter.adapterConfig);

    this.adapter = adapterInstance;
  }

  protected registerHandler = (handler: Class<IHandler>): void => {
    const instance: IHandler = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      return;
    }

    const Target = this.reflectName(handler);
    const data = new Target();
    this.adapter.subscribe(this.subscribe(instance), data);
    this.logger.debug({ data }, 'RegisterHandler');
  };

  onModuleDestroy() {
    this.adapter.close();
  }

}
