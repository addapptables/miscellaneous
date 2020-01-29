import { Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { IBusAdapter } from '../interfaces/bus/bus-adapter.interface';
import { ITransferData } from '../interfaces/transfer-data';
import { TransferDataDto } from '../interfaces/transfer-data-dto.interface';

export class LocalBusAdapter implements IBusAdapter {

  private bus: Subject<ITransferData<TransferDataDto>>;

  private readonly logger: Logger;

  constructor() {
    this.bus = new Subject();
    this.logger = new Logger(LocalBusAdapter.name);
  }

  publish(data: ITransferData<TransferDataDto>): void {
    this.logger.debug({ ...data, sendData: true }, data.context);
    this.bus.next(data);
  }

  async subscribe(handle: Function, data: ITransferData<TransferDataDto>): Promise<void> {
    const internalHandle = async (msg: ITransferData<TransferDataDto>) => {
      try {
        await handle(msg);
        this.logger.debug({ ...msg, receivedData: true }, msg.context);
      } catch (error) {
        this.logger.error({ message: error.message, msg }, 'bus-adapter', msg.context);
      }
    }
    this.bus.asObservable().pipe(
      filter(filter => filter.action === data.action && filter.context === data.context),
      tap(internalHandle)
    ).subscribe();
  }

  close() {
    this.bus.complete();
  }

}
