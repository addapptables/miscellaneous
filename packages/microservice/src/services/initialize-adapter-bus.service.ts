import { MicroserviceOptions, IBusAdapter, OnInit, SetOptions } from '../interfaces';
import { BusConfigException } from '../exceptions';

export class InitializeAdapterBus {

  constructor(
    private readonly microserviceOptions: MicroserviceOptions
  ) { }

  // TODO: apply design pattern
  async init(config: any): Promise<IBusAdapter> {
    const adapterConfig = this.microserviceOptions.adapter;

    if (!adapterConfig) {
      throw new BusConfigException('The Bus Adapter was not configured.');
    }

    const AdapterPrototype = adapterConfig.adapterPrototype;

    if (!AdapterPrototype) {
      throw new BusConfigException('The Bus Adapter Prototype was not configured.');
    }

    const adapterInstance: IBusAdapter = new AdapterPrototype();

    if (typeof adapterInstance[SetOptions] === 'function') {
      await adapterInstance[SetOptions](config);
    }

    if (typeof adapterInstance[OnInit] === 'function') {
      await adapterInstance[OnInit]();
    }

    return adapterInstance;
  }

}