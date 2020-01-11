import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Module } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { ICommandHandler } from '../interfaces/commands/command-handler.interface';
import { ICommandDto } from '../interfaces/commands/command-dto-interface';
import { IEventHandler } from '../interfaces/events/event-handler.interface';
import { IEventDto } from '../interfaces/events/event-dto.interface';
import { COMMAND_HANDLER_METADATA, EVENT_HANDLER_METADATA } from '../config';
import { TypeHandler } from '../types';
import { ICommand, IEvent } from '../interfaces';

@Injectable()
export class ExplorerService {

  constructor(private readonly modulesContainer: ModulesContainer) { }

  getCommands(): Type<ICommandHandler<ICommand<ICommandDto>>>[] {
    const modules = [...this.modulesContainer.values()];
    const commands = this.flatMap<ICommandHandler<ICommand<ICommandDto>>>(modules, instance =>
      this.filterProvider(instance, COMMAND_HANDLER_METADATA)
    );
    return commands;
  }

  getEvents(): Type<IEventHandler<IEvent<IEventDto>>>[] {
    const modules = [...this.modulesContainer.values()];
    const events = this.flatMap<IEventHandler<IEvent<IEventDto>>>(modules, instance =>
      this.filterProvider(instance, EVENT_HANDLER_METADATA)
    );
    return events;
  }

  flatMap<T>(
    modules: Module[],
    callback: (instance: InstanceWrapper) => TypeHandler | undefined
  ): TypeHandler[] {
    const items = modules
      .map(module => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter(element => !!element) as TypeHandler[];
  }

  filterProvider(
    wrapper: InstanceWrapper,
    metadataKey: string
  ): TypeHandler | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  extractMetadata(instance: Object, metadataKey: string): TypeHandler {
    if (!instance.constructor) {
      return undefined;
    }
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
    return metadata ? (instance.constructor as TypeHandler) : undefined;
  }

}
