import { IAdapterBusConfig } from '../bus-adapters/manager-adapter-bus';

export interface Logger {
    debug?: boolean;
    warn?: boolean;
    error?: boolean;
    verbose?: boolean;
}

export interface MicroserviceOptions {
    adapter: IAdapterBusConfig;
    logger?: Logger;
};
