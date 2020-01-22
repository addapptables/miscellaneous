import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Bus } from './bus';
import { ICommandHandler } from './interfaces/commands/command-handler.interface';
import { ICommand } from './interfaces/commands/command.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';
import { COMMAND_HANDLER_METADATA } from './config';
import { ExplorerService } from './services/explore.service';
import { IHandler } from './interfaces';

@Injectable()
export class CommandBus extends Bus {

  constructor(
    private readonly explorerService: ExplorerService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef);
  }

  publish(data: ICommand<ICommandDto>): any {
    return this.adapter.publish(data);
  }

  protected registerHandlers(): void {
    const handlers = this.explorerService.getCommandHandlers();
    handlers.forEach(this.registerHandler);
  }

  protected reflectName(handler: Type<ICommandHandler<ICommand<ICommandDto>>>): FunctionConstructor {
    return Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler);
  }

  protected subscribe = (handle: IHandler<any>): (data: any) => Promise<any> =>
    async (data: any): Promise<any> => {
      const context = 'addapptables-saga';
      const action = 'saga-event';
      let eventData = { ...data, action, context };

      try {

        await handle.handle(data);

      } catch (error) {

        eventData = { ...eventData, error: error.message };

      } finally {

        await this.adapter.publish(eventData);

      }

    }

}
