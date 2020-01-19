import { Inject, Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { CONFIG_PROVIDER_TOKEN } from '../config/constants.config';
import { MicroserviceOptions, IBusAdapter, IHandler } from '../interfaces';
import { IOnInitAdapter } from '../interfaces/bus/bus-adapter.interface';
import { Command } from '../command';
import { Event } from '../event';
import { HandlerTypes } from '../enums/handler-types.enum';
import { ExplorerService } from './explore.service';

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

interface ISagaInstance {
  adapter: IBusAdapter;
  type: HandlerTypes;
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

  end<T = any>(): Promise<T> {
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
        const adapter = this.saga.adapters.find(adapter => adapter.type === HandlerTypes.EVENT);
        adapter.adapter.publish(data);
      }
    });
  }

}

// TODO: add typigin to this class
@Injectable()
export class Saga {

  public adapters: ISagaInstance[] = [];
  public sagas: ISagaProcess = {};

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly microserviceOptions: MicroserviceOptions[],
    private readonly explorerService: ExplorerService
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

      let metadata;
      if (option.type === HandlerTypes.COMMAND) {
        metadata = this.explorerService.getCommands().map(command => new command());
      }
      if (option.type === HandlerTypes.EVENT) {
        metadata = this.explorerService.getEvents().map(event => new event());
      }

      await adapterInstance.subscribeAll(this.subscribe, metadata);
    });

  }

  // TODO: make a wrap for this arguments
  private subscribe = async (data: any) => {
    if (!this.sagas[data.cid]) {
      return;
    }

    await this.sagas[data.cid].handle(data);
    delete this.sagas[data.cid];
  }

  start(): ISagaStart {
    const sagaProcess = new SagaProcess(this);

    return sagaProcess;
  }

}
