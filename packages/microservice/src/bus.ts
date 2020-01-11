import { ModuleRef } from '@nestjs/core';

import { Handler, TypeHandler } from './types';
import { ICommand } from './interfaces/commands/command.interface';
import { IEvent } from './interfaces/events/event.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';
import { IEventDto } from './interfaces/events/event-dto.interface';
import { IBusAdapter } from './interfaces/bus/bus-adapter.interface';

// TODO: implement adapter steps
export abstract class Bus {

  protected adapter: IBusAdapter;

  constructor(protected readonly moduleRef: ModuleRef) { }

  abstract publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): any;

  protected abstract registerHandlers(): void;

  protected abstract reflectName(handler: TypeHandler): FunctionConstructor;

  protected abstract resolveAdapter(): void;

  async init(): Promise<void> {
    await this.resolveAdapter();
    await this.registerHandlers();
  }

  protected registerHandler = (handler: TypeHandler): void => {
    const instance: TypeHandler = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      return;
    }

    const target = this.reflectName(handler);

    this.adapter.subscribe(instance, <any>target);
  };

}
