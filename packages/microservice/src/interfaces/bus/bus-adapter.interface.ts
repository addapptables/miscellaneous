import { ITransferData } from '../transfer-data';
import { TransferDataDto } from '../transfer-data-dto.interface';

export interface IBusAdapter {
  publish(data: ITransferData<TransferDataDto>, options?: any): Promise<void>;
  subscribe(handle: Function, data: ITransferData<TransferDataDto>, options?: any): Promise<void>;
  close(): void | Promise<void>;
}
