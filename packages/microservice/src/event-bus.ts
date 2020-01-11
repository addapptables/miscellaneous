import { Injectable, Type, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Bus } from './bus';
import { IEventHandler } from './interfaces/events/event-handler.interface';
import { IEvent } from './interfaces/events/event.interface';
import { IEventDto } from './interfaces/events/event-dto.interface';
import { EVENT_HANDLER_METADATA } from './config';
import { ExplorerService } from './services/explore.service';
import { ModuleConfig, Types } from './module';

@Injectable()
export class EventBus extends Bus {

  constructor(
    private readonly explorerService: ExplorerService,
    @Inject('ConfigProvider')
    private readonly configProvider: ModuleConfig[],
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

  // TODO: refactor this method
  protected async resolveAdapter(): Promise<void> {
    const adapterConfig = this.configProvider.find(config => [Types.EVENT, Types.ALL].includes(config.type));

    if (!adapterConfig) {
      // TODO: create an exception class
      throw new Error('The Bus Adapter was not configure for the Event.');
    }

    // TODO: figure out the best way to set the adapter
    this.adapter = adapterConfig.adapter;

    // TODO: figure out the best way to set the adapter
    this.adapter = adapterConfig.adapter;

    // TODO: figure out what is the best way
    if (typeof this.adapter['onInit'] === 'function') {
      await this.adapter['onInit']();
    }

  }

  protected reflectName(handler: Type<IEventHandler<IEvent<IEventDto>>>): FunctionConstructor {
    return Reflect.getMetadata(EVENT_HANDLER_METADATA, handler);
  }

}
