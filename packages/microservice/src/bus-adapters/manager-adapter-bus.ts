import { Class } from '../types';
import { IBusAdapter, IEvent, IEventDto } from '../interfaces';
import { ISetOptions } from '../interfaces/set-options.interface';

type AdapterConfigOf<TAdapter extends Class<IBusAdapter>> =
  InstanceType<TAdapter> extends ISetOptions<infer TConfig>
  ? TConfig
  : any;

export interface IManagerAdapterBusWithConfig<TConfig = any> {
  withConfig(config: TConfig): IManagerAdapterBusBuild<TConfig>;
  build(): IAdapterBusConfig<TConfig | undefined>;
}

export interface IAdapterBusSagaConfig<T = any> {
  config: T;
  events: Class<IEvent<IEventDto>>[];
}

export interface IAdapterBusConfig<TConfig = any> {
  adapterPrototype: Class<IBusAdapter>;
  adapterConfig: TConfig;
}

export interface IManagerAdapterBusBuild<TConfig = any> {
  build(): IAdapterBusConfig<TConfig | undefined>;
}

export class ManagerAdapterBus<TConfig = any>
  implements
  IManagerAdapterBusWithConfig<TConfig>,
  IManagerAdapterBusBuild<TConfig> {
  private adapterConfig: TConfig | undefined;

  private constructor(private readonly prototype: Class<IBusAdapter>) {}

  static getInstance<TAdapter extends Class<IBusAdapter>>(
    prototype: TAdapter
  ): IManagerAdapterBusWithConfig<AdapterConfigOf<TAdapter>> {
    return new ManagerAdapterBus<AdapterConfigOf<TAdapter>>(prototype);
  }

  withConfig(config: TConfig): IManagerAdapterBusBuild<TConfig> {
    this.adapterConfig = config;
    return this;
  }

  build(): IAdapterBusConfig<TConfig | undefined> {
    return {
      adapterPrototype: this.prototype,
      adapterConfig: this.adapterConfig
    };
  }
}
