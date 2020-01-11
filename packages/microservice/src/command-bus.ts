import { Injectable, Type, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Bus } from './bus';
import { ICommandHandler } from './interfaces/commands/command-handler.interface';
import { ICommand } from './interfaces/commands/command.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';
import { COMMAND_HANDLER_METADATA } from './config';
import { ExplorerService } from './services/explore.service';
import { ModuleConfig, Types } from './module';
import { IOnInitAdapter } from './interfaces/bus/bus-adapter.interface';

@Injectable()
export class CommandBus extends Bus {

  constructor(
    private readonly explorerService: ExplorerService,
    @Inject('ConfigProvider')
    private readonly configProvider: ModuleConfig[],
    moduleRef: ModuleRef
  ) {
    super(moduleRef);
  }

  publish(data: ICommand<ICommandDto>): any {
    return this.adapter.publish(data);
  }

  protected registerHandlers(): void {
    const handlers = this.explorerService.getCommands();
    handlers.forEach(this.registerHandler);
  }

  // TODO: refactor this method
  protected async resolveAdapter(): Promise<void> {
    const adapterConfig = this.configProvider.find(config => [Types.COMMAND, Types.ALL].includes(config.type));

    if (!adapterConfig) {
      // TODO: create an exception class
      throw new Error('The Bus Adapter was not configure for the Command.');
    }

    // TODO: figure out the best way to set the adapter
    this.adapter = adapterConfig.adapter;

    // TODO: figure out what is the best way
    if (typeof this.adapter['onInit'] === 'function') {
      await this.adapter['onInit']();
    }

  }

  protected reflectName(handler: Type<ICommandHandler<ICommand<ICommandDto>>>): FunctionConstructor {
    return Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler);
  }

}
