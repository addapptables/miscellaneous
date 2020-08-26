import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  BROKER_CONTEXT,
  BROKER_ACTION,
} from '../../config/constants.config';
import {
  IBusAdapter,
  IBrokerStart,
} from '../../interfaces';
import { Broker } from './broker';
import { BrokerProcess } from './broker-process';
import { ITransferData } from '../../interfaces/transfer-data';
import { TransferDataDto } from '../../interfaces/transfer-data-dto.interface';
import { CraftsLogger } from '../../logger';

@Injectable()
export class BrokerService implements OnModuleDestroy {
  private adapterInstance: IBusAdapter;

  constructor(private readonly logger: CraftsLogger) {}

  async onInit(adapterInstance: IBusAdapter) {
    const config = {
      context: BROKER_CONTEXT,
      action: BROKER_ACTION,
      data: null,
    };
    const options = { service: 'broker' };
    adapterInstance.subscribe(this.subscribe, config, options);
    this.adapterInstance = adapterInstance;
  }

  private subscribe = async (data: ITransferData<TransferDataDto>) => {
    const brokers = Broker.getInstance();
    const handle = brokers.get(data.cid);
    if (typeof handle !== 'function') {
      return;
    }
    await handle(data);
    brokers.delete(data.cid);
  };

  start(): IBrokerStart {
    const brokerProcess = new BrokerProcess(this.adapterInstance, this.logger);

    return brokerProcess;
  }

  onModuleDestroy() {
    this.adapterInstance.close();
  }
}
