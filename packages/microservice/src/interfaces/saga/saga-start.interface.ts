import { ISagaAdd } from './saga-add.interface';
import { ITransferData } from '../transfer-data';
import { TransferDataDto } from '../transfer-data-dto.interface';

export interface ISagaStart {
    add(data: ITransferData<TransferDataDto>): ISagaAdd;
}
