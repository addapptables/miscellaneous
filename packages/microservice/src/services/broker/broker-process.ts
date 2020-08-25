import * as uuid from 'uuid';
import { IBrokerStart } from '../../interfaces/broker/broker-start.interface';
import { IBrokerAdd } from '../../interfaces/broker/broker-add.interface';
import { IBusAdapter } from '../../interfaces';
import { ITransferData } from '../../interfaces/transfer-data';
import { TransferDataDto } from '../../interfaces/transfer-data-dto.interface';
import { Broker } from './broker';
import { CraftsLogger } from '../../logger/services/logger.service';

export class BrokerProcess implements IBrokerStart, IBrokerAdd {
  private readonly cid: string;

  private data: ITransferData<TransferDataDto>;

  constructor(
    private readonly adapter: IBusAdapter,
    private readonly logger: CraftsLogger
  ) {
    this.cid = uuid.v4();
  }

  add(data: ITransferData<TransferDataDto>): IBrokerAdd {
    this.data = data;
    return this;
  }

  end<T = any>(): Promise<ITransferData<T>> {
    const brokers = Broker.getInstance();
    return new Promise(async (resolve, reject) => {
      const timeResult = setTimeout(() => { this.logger.warn(`Are you sure you have registered the handler ${this.data.context}-${this.data.action}?`, BrokerProcess.name) }, 2000);
      brokers.add(this.cid, (data: ITransferData<T>) => {
        clearTimeout(timeResult);
        try {
          if (!data.error) {
            return resolve(data);
          }
          reject(data);
        } catch (error) {
          reject(error);
        }
      });

      const data = { ...this.data, cid: this.cid };
      await this.adapter.publish(data);
    });
  }
}
