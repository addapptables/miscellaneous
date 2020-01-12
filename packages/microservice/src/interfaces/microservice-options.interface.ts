import { HandlerTypes } from '../enums/handler-types.enum';
import { IBusAdapter } from './bus/bus-adapter.interface';

export interface MicroserviceOptions {
    type: HandlerTypes;
    adapter: IBusAdapter;
};