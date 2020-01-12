import { Module, OnModuleInit, DynamicModule } from '@nestjs/common';
import { TypeHandler } from './types';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { InitializeMicroservice } from './services/initialize-microservice.service';
import { CONFIG_PROVIDER_TOKEN } from './config/constants.config';

@Module({
  providers: [
    InitializeMicroservice,
  ],
  exports: [],
})
export class MicroserviceModule implements OnModuleInit {

  constructor(
    private readonly initializeMicroservice: InitializeMicroservice
  ) { }

  // TODO: refactor this code
  static withConfig(config: MicroserviceOptions | MicroserviceOptions[], handlers?: TypeHandler[]): DynamicModule {
    // TODO: control when one config just comes
    const configTransformed = Array.isArray(config) ? config : [config];

    const configProvider = {
      provide: CONFIG_PROVIDER_TOKEN,
      useValue: configTransformed,
    };

    return {
      module: MicroserviceModule,
      providers: [...handlers, configProvider],
    }
  }

  static register(handlers: TypeHandler[]): DynamicModule {
    return {
      module: MicroserviceModule,
      providers: [...handlers],
    };
  }

  async onModuleInit() {
    await this.initializeMicroservice.init();
  }

}
