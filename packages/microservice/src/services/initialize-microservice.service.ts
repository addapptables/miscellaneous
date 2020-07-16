import { Injectable } from '@nestjs/common';
import { CommandBus } from '../command-bus';
import { EventBus } from '../event-bus';
import { BrokerService } from './broker/broker.service';
import { QueryBus } from '../query-bus';
import { InitializeAdapterBus } from './initialize-adapter-bus.service';
import { ModuleRef } from '@nestjs/core';
import { MicroserviceOptions } from '../interfaces/microservice-options.interface';
import { MICROSERVICE_CONFIG_PROVIDER } from '../config';

@Injectable()
export class InitializeMicroservice {

  private readonly microserviceOptions: MicroserviceOptions;

  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly brokerService: BrokerService,
    private readonly moduleRef: ModuleRef
  ) {
    this.microserviceOptions = this.moduleRef.get(MICROSERVICE_CONFIG_PROVIDER);
  }

  async init() {
    const adapterInstance = await new InitializeAdapterBus(
      this.microserviceOptions,
      this.moduleRef
    ).init(this.microserviceOptions?.adapter?.adapterConfig);
    await this.eventBus.onInit(adapterInstance);
    await this.commandBus.onInit(adapterInstance);
    await this.queryBus.onInit(adapterInstance);
    await this.brokerService.onInit(adapterInstance);
  }
}
