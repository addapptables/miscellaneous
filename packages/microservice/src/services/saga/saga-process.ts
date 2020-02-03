import * as uuid from 'uuid/v4';
import { ISagaStart } from '../../interfaces/saga/saga-start.interface';
import { ISagaAdd } from '../../interfaces/saga/saga-add.interface';
import { IBusAdapter } from '../../interfaces';
import { ITransferData } from '../../interfaces/transfer-data';
import { TransferDataDto } from '../../interfaces/transfer-data-dto.interface';
import { Saga } from './saga';

export class SagaProcess implements ISagaStart, ISagaAdd {

	private readonly cid: string;

	private data: ITransferData<TransferDataDto>;

	constructor(private readonly adapter: IBusAdapter) {
		this.cid = uuid();
	}

	add(data: ITransferData<TransferDataDto>): ISagaAdd {
		this.data = data;
		return this;
	}

	end<T = any>(): Promise<T> {
		const sagas = Saga.getInstance();
		return new Promise(async (resolve, reject) => {
			sagas.add(this.cid, (data: T) => {
				// TODO: add logger
				try {
					resolve(data);
				} catch (error) {
					// TODO: catch message with errors
					reject(error);
				}
			});

			const data = { ...this.data, cid: this.cid };

			await this.adapter.publish(data);
		});
	}

}