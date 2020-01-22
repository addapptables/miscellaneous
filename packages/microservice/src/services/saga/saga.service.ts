import { Inject, Injectable } from '@nestjs/common';
import { MICROSERVICE_CONFIG_PROVIDER } from '../../config/constants.config';
import { MicroserviceOptions, IBusAdapter, IOnInit, OnInit, ISagaStart } from '../../interfaces';
import { Saga } from './saga';
import { SagaProcess } from './saga-process';
import { ITransferData } from '../../interfaces/transfer-data';
import { TransferDataDto } from '../../interfaces/transfer-data-dto.interface';

@Injectable()
export class SagaService implements IOnInit {

  private adapterInstance: IBusAdapter;

  constructor(
    @Inject(MICROSERVICE_CONFIG_PROVIDER)
    private readonly microserviceOptions: MicroserviceOptions
  ) { }

  async onInit() {
    // TODO: Create a class for call life cycles
    const adapterConfig = this.microserviceOptions.adapter;
    const AdapterPrototype = adapterConfig.adapterPrototype;
    const adapterInstance: IBusAdapter = new AdapterPrototype(adapterConfig.adapterSagaConfig);
    if (typeof adapterInstance[OnInit] === 'function') {
      await adapterInstance[OnInit]();
    }
    const config = { context: 'addapptables-saga', action: 'saga-event', data: null };
    const options = { service: 'saga' };
    adapterInstance.subscribe(this.subscribe, config, options);
    this.adapterInstance = adapterInstance;
  }

  private subscribe = async (data: ITransferData<TransferDataDto>) => {
    const sagas = Saga.getInstance();
    const handle = sagas.get(data.cid);
    if (typeof handle !== 'function') {
      return;
    }
    await handle(data);
    sagas.delete(data.cid);
  }

  start(): ISagaStart {
    const sagaProcess = new SagaProcess(this.adapterInstance);

    return sagaProcess;
  }

}
