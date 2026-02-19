import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import { MicroserviceModule } from '../src/module';
import { MICROSERVICE_CONFIG_PROVIDER } from '../src/config/constants.config';
import { IBusAdapter } from '../src/interfaces';
import { ITransferData } from '../src/interfaces/transfer-data';
import { TransferDataDto } from '../src/interfaces/transfer-data-dto.interface';

describe('MicroserviceModule', () => {
  it('should load MicroserviceModule with config correctly', async () => {
    class MockAdapter implements IBusAdapter {
      async publish(data: ITransferData<TransferDataDto>, options?: any): Promise<void> {}
      async subscribe(handle: Function, data: ITransferData<TransferDataDto>, options?: any): Promise<void> {}
      close(): void | Promise<void> {}
    }
    
    const module = await Test.createTestingModule({
      imports: [MicroserviceModule.withConfig({
        adapter: {
          adapterPrototype: MockAdapter,
          adapterConfig: {},
        },
      })],
    }).compile();

    chai.expect(module.get(MICROSERVICE_CONFIG_PROVIDER)).not.undefined;
  });
});
