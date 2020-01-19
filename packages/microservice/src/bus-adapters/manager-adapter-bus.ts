import { Class } from '../types';
import { IBusAdapter } from '../interfaces';

export interface IManagerAdapterBusWithConfig<T = any> {
  withConfig(config: T): IManagerAdapterBusWithSagaConfig;
  build(): IAdapterBusConfig;
}

export interface IManagerAdapterBusWithSagaConfig<T = any> {
  withSagaConfig(config: T): IManagerAdapterBusBuild;
}

export interface IAdapterBusConfig<T = any> {
  adapterPrototype: Class<IBusAdapter>;
  adapterConfig: T;
  adapterSagaConfig?: T;
}

export interface IManagerAdapterBusBuild {
  build(): IAdapterBusConfig;
}

export class ManagerAdapterBus<T = any> implements IManagerAdapterBusWithConfig<T>, IManagerAdapterBusWithSagaConfig<T>, IManagerAdapterBusBuild {

  private adapterConfig: T;

  private adapterSagaConfig: T;

  private constructor(private readonly prototype: Class<IBusAdapter>) { }

  static getInstance<T = any>(prototype: Class<IBusAdapter>): IManagerAdapterBusWithConfig {
    return new ManagerAdapterBus<T>(prototype);
  }

  withConfig(config: T): IManagerAdapterBusWithSagaConfig {
    this.adapterConfig = config;
    return this;
  }

  withSagaConfig(config: T): IManagerAdapterBusBuild {
    this.adapterSagaConfig = config;
    return this;
  }

  build(): IAdapterBusConfig {
    return {
      adapterPrototype: this.prototype,
      adapterConfig: this.adapterConfig,
      adapterSagaConfig: this.adapterSagaConfig,
    };
  }

}
