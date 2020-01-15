import { InitializeMicroservice } from './services/initialize-microservice.service'
import { Inject } from '@nestjs/common';

interface ISaga {

  publish(): Promise<void>;

  subscribe(): Promise<void>;

  init(): Promise<void>;

}

interface IAdapterSaga {
  createSaga() { }
}

class Adapter implements IAdapterSaga {
  createSaga() {

  }
}


interface ICreateSaga {
  publish();
  subscribe();
}



export class Saga {



  async onInit() {
    this.commandAdapter = await (new Adapter()).createSaga();
    this.queryAdapter = await (new Adapter()).createSaga();
    this.eventAdapter = await (new Adapter()).createSaga();
  }

  //   publish(command: Command | Query | Event) {
  //   }

  //   subscribe((): Promise<void>) {
  // }

  init(): ICreateSaga {
    return {
      publish() { },
      subscribe() { },
    };
  }

}

const saga = new Saga();

const provider = {
  provide: 'saga',
  asValue: saga,
}


class Service {

  constructor(private readonly saga: Saga) { }

  create() {
    const saga: ICreateSaga = this.saga.init();
    saga.subscribe(() => { });
    saga.publish({});
  }

}

