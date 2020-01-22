import { Inject, Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { CONFIG_PROVIDER_TOKEN } from '../config/constants.config';
import { MicroserviceOptions, IBusAdapter } from '../interfaces';
import { IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';

interface ISagaAdd {
  // add(): ISagaAdd<T>;
  end<T = any>(): Promise<T>;
}

interface ISagaStart {
  add(data: any): ISagaAdd;
}

interface ISagaProcess {
  [key: string]: {
    handle<T>(data: T): void;
  };
}

class SagaProcess implements ISagaStart, ISagaAdd {

  private readonly cid: string;
  private data: any;

  constructor(private readonly saga: Saga) {
    this.cid = uuid();
  }

  add(data: any): ISagaAdd {
    this.data = data;

    return this;
  }

  // TODO: improve this code
  end<T = any>(): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.saga.sagas[this.cid] = {
        handle: (data: any) => {
          try {
            resolve(data);
          } catch (error) {
            reject(error);
          }
        },
      };

      const data = { ...this.data, cid: this.cid };

      await this.saga.adapterInstance.publish(data);
    });
  }

}

// TODO: add typing to this class
@Injectable()
export class Saga {

  // TODO: analyze this code SOOOOOOOO IMPORTANTTTTTTTT!!!!!!!!!!
  public adapterInstance: IBusAdapter;
  public sagas: ISagaProcess = {};

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly microserviceOptions: MicroserviceOptions
  ) { }

  async onInit() {
    const adapterConfig = this.microserviceOptions.adapter;

    const AdapterPrototype = adapterConfig.adapterPrototype;
    const adapterInstance: IBusAdapter = new AdapterPrototype(adapterConfig.adapterSagaConfig);

    if (typeof adapterInstance[IOnInitAdapter] === 'function') {
      await adapterInstance[IOnInitAdapter]();
    }

    // TODO: this has to be in a file
    const config = { context: 'addapptables-saga', action: 'saga-event', data: null };
    const options = { service: 'saga' };
    adapterInstance.subscribe(this.subscribe, config, options);

    this.adapterInstance = adapterInstance;
  }

  // TODO: make a wrap for this arguments
  private subscribe = async (data: any) => {
    if (!this.sagas[data.cid]) {
      return;
    }

    // TODO: think if remove the action and context fields
    await this.sagas[data.cid].handle(data);
    delete this.sagas[data.cid];
  }

  start(): ISagaStart {
    const sagaProcess = new SagaProcess(this);

    return sagaProcess;
  }

}
