import { Inject, Injectable } from '@nestjs/common';
import { MICROSERVICE_CONFIG_PROVIDER } from '../../config/constants.config';
import { MicroserviceOptions, IBusAdapter, IOnInit, OnInit, ISagaStart } from '../../interfaces';
import { Saga } from './saga';
import { SagaProcess } from './saga-process';
import { ITransferData } from '../../interfaces/transfer-data';
import { TransferDataDto } from '../../interfaces/transfer-data-dto.interface';
import { InitializeAdapterBus } from '../initialize-adapter-bus.service';

@Injectable()
export class SagaService implements IOnInit {

  private adapterInstance: IBusAdapter;

  constructor(
    @Inject(MICROSERVICE_CONFIG_PROVIDER)
    private readonly microserviceOptions: MicroserviceOptions
  ) { }

  async onInit() {
    const adapterInstance = await (new InitializeAdapterBus(this.microserviceOptions))
      .init(this.microserviceOptions.adapter.adapterSagaConfig);
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
