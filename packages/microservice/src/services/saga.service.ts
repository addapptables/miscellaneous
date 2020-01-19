import { Inject } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { CONFIG_PROVIDER_TOKEN } from '../config/constants.config';
import { MicroserviceOptions, IBusAdapter, IHandler } from '../interfaces';
import { IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';
import { Command } from '../command';
import { HandlerTypes } from '../enums/handler-types.enum';

interface ISagaAdd<T> {
  // add(): ISagaAdd<T>;
  end(): Promise<T>;
}

interface ISagaStart<T> {
  add(): ISagaAdd<T>;
}

interface ISagaProcess {
  [key: string]: {
    handle<T>(data: T): void;
  };
}

interface ISagaInstance {
  adapter: IBusAdapter;
  type: HandlerTypes;
}


class SagaProcess {

  private readonly cid: string;
  private data: any;

  constructor(private readonly saga: Saga) {
    this.cid = uuid();
  }

  add(data: any) {
    this.data = data;
  }

  end() {
    return new Promise((resolve, reject) => {
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
      if (this.data instanceof Command) {
        const adapter = this.saga.adapters.find(adapter => adapter.type === HandlerTypes.COMMAND);
        adapter.adapter.publish(data);
      }
      if (this.data instanceof Event) {
        const adapter = this.saga.adapters.find(adapter => adapter.type === HandlerTypes.COMMAND);
        adapter.adapter.publish(data);
      }
    });
  }

  private getBusAdapter(handlerTypes: HandlerTypes) {
    this.saga.adapters.find((adapter) => { adapter })
  }
}


export class Saga {

  public adapters: ISagaInstance[] = [];
  public sagas: ISagaProcess = {};

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly microserviceOptions: MicroserviceOptions[]
  ) { }

  onInit() {
    this.microserviceOptions.forEach(async (option) => {
      const AdapterPrototype = option.adapter.adapterPrototype;
      const adapterInstance: IBusAdapter = new AdapterPrototype(option.adapter.adapterSagaConfig);

      if (typeof adapterInstance[IOnInitAdapter] === 'function') {
        await adapterInstance[IOnInitAdapter]();
      }

      this.adapters.push({
        adapter: adapterInstance,
        type: option.type,
      });

      adapterInstance.subscribe({ handle: this.subscribe });
    });

  }

  // TODO: create typing for this variable
  private subscribe = (data: any) => {
    if (!this.sagas[data.cid]) {
      return;
    }

    this.sagas[data.cid].handle(data);
    delete this.sagas[data.cid];
  }

  start<T>(): ISagaStart<T> {


    const sagaProcess = new SagaProcess();

    return sagaProcess;

    const saga = {

      add(foo) {
        foos.push(foo);
      },

      end() {

        return new Promise((resolve, reject) => {

          this.process[cid] = {
            handle: (data) => {
              try {
                resolve(data);
              } catch (error) {
                reject(error);
              }
            },
          };

          foos.forEach((foo) => {
            adapter.publish({ correlationId, ...foo }));
        })


      });


  },
}

return {
  add(): any { },
};
  }


}


