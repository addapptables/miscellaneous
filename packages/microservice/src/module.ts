import { Module, OnModuleInit, DynamicModule } from '@nestjs/common';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { InitializeMicroservice } from './services/initialize-microservice.service';
import { MICROSERVICE_CONFIG_PROVIDER } from './config/constants.config';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explore.service';
import { BrokerService } from './services/broker/broker.service';
import { IHandler } from './interfaces';
import { Class } from './types';

@Module({
  providers: [
    InitializeMicroservice,
    CommandBus,
    EventBus,
    QueryBus,
    ExplorerService,
    BrokerService,
  ],
  exports: [
    BrokerService,
    EventBus,
  ],
})
export class MicroserviceModule implements OnModuleInit {

  constructor(
    private readonly initializeMicroservice: InitializeMicroservice
  ) { }

  static withConfig(config: MicroserviceOptions, handlers?: Class<IHandler>[]): DynamicModule {
    const configProvider = {
      provide: MICROSERVICE_CONFIG_PROVIDER,
      useValue: config,
    };

    return {
      module: MicroserviceModule,
      providers: [...(handlers || []), configProvider],
    }
  }

  static register(handlers: Class<IHandler>[]): DynamicModule {
    return {
      module: MicroserviceModule,
      providers: [...handlers],
    };
  }

  async onModuleInit() {
    await this.initializeMicroservice.init();
  }

}
