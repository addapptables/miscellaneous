import { HandlerTypes } from '../enums/handler-types.enum';
import { IAdapterBusConfig } from '../bus-adapters/manager-adapter-bus';

export interface MicroserviceOptions {
    type: HandlerTypes;
    adapter: IAdapterBusConfig;
};
