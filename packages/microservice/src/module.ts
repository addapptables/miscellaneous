import { Module, OnModuleInit, DynamicModule } from '@nestjs/common';

// TODO: facade to the view WOOOOWww change it
import { FacadeChangeName } from './services/facade-changename.service';
import { IBusAdapter } from './interfaces/bus/bus-adapter.interface';
import { TypeHandler } from './types';

export enum Types {
  COMMAND = 'command',
  EVENT = 'event',
  QUERY = 'query',
  ALL = '*',
}

export type ModuleConfig = {
  type: Types;
  adapter: IBusAdapter;
};


@Module({
  providers: [
    FacadeChangeName,
  ],
  exports: [],
})
export class MicroserviceModule implements OnModuleInit {

  constructor(
    private readonly facadeChangeName: FacadeChangeName
  ) { }

  // TODO: refactor this code
  static withConfig(config: ModuleConfig | ModuleConfig[], handlers?: TypeHandler[]): DynamicModule {
    // TODO: control when one config just comes
    const configTransformed = Array.isArray(config) ? config : [config];

    const configProvider = {
      provide: 'ConfigProvider',
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
    await this.facadeChangeName.init();
  }

}
