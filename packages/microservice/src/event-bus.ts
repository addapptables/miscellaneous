import { Injectable, Type, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Bus } from './bus';
import { IEventHandler } from './interfaces/events/event-handler.interface';
import { IEvent } from './interfaces/events/event.interface';
import { IEventDto } from './interfaces/events/event-dto.interface';
import { EVENT_HANDLER_METADATA } from './config';
import { ExplorerService } from './services/explore.service';
import { MicroserviceOptions } from './interfaces/microservice-options.interface';
import { HandlerTypes } from './enums/handler-types.enum';
import { IOnInitAdapter } from './interfaces/bus/bus-adapter.interface';

@Injectable()
export class EventBus extends Bus {

  constructor(
    private readonly explorerService: ExplorerService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef);
  }

  publish(data: IEvent<IEventDto>): any {
    return this.adapter.publish(data);
  }

  protected registerHandlers(): void {
    const handlers = this.explorerService.getEvents();
    handlers.forEach(this.registerHandler);
  }

  protected get getHandlerTypeType() {
    return HandlerTypes.EVENT;
  }

  protected reflectName(handler: Type<IEventHandler<IEvent<IEventDto>>>): FunctionConstructor {
    return Reflect.getMetadata(EVENT_HANDLER_METADATA, handler);
  }

}
