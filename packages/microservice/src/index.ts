import 'reflect-metadata';

export { AggregateRoot } from './aggregate-root';
export { Command } from './command';
export { Event } from './event';
export { CommandBus } from './command-bus';
export { EventBus } from './event-bus';
export { MicroserviceModule } from './module';
export { BrokerService as Broker } from './services/broker/broker.service';

export * from './decorators';
export * from './interfaces';
export * from './bus-adapters';
export * from './types';
