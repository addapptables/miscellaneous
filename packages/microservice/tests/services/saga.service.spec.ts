import * as chai from 'chai';
import * as sinon from 'sinon';
import { SagaService } from '../../src/services/saga/saga.service';
import { IBusAdapter } from '../../src/interfaces';
import { ITransferData } from '../../src/interfaces/transfer-data';
import { TransferDataDto } from '../../src/interfaces/transfer-data-dto.interface';
import { InitializeAdapterBus } from '../../src/services/initialize-adapter-bus.service';
import { SagaProcess } from '../../src/services/saga/saga-process';

describe('Saga manager', () => {

  let saga: SagaService;

  class TestBusAdapter implements IBusAdapter {
    async publish(data: ITransferData<TransferDataDto>, options?: any): Promise<void> { }
    async subscribe(handle: Function, data: ITransferData<TransferDataDto>, options?: any): Promise<void> { }
    close(): void | Promise<void> { }
  }

  const sagaConfig = {
    adapter: {
      adapterPrototype: TestBusAdapter,
      adapterConfig: {}, adapterSagaConfig: {},
    },
  };

  before(() => {
    saga = new SagaService(sagaConfig);
  });

  describe('should run life-cycle methods correctly', () => {
    const sandbox = sinon.createSandbox();
    let subscribe, close, initializeAdapterBusInitMethod;

    beforeEach(() => {
      subscribe = sandbox.spy();
      close = sandbox.spy();
      initializeAdapterBusInitMethod = sandbox.stub(InitializeAdapterBus.prototype, 'init')
        .returns(<any>{ subscribe, close });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should initialize saga correctly', async () => {
      await saga.onInit();

      chai.expect(saga['adapterInstance'] instanceof TestBusAdapter);
      chai.expect(initializeAdapterBusInitMethod.calledOnce).to.true;
      chai.expect(subscribe.calledOnce).to.true;
      chai.expect(typeof subscribe.getCall(0).args[0]).to.equal('function');
      chai.expect(subscribe.getCall(0).args[1])
        .deep.equal({ context: 'addapptables-saga', action: 'saga-event', data: null });
      chai.expect(subscribe.getCall(0).args[2]).deep.equal({ service: 'saga' });
    });

    it('should destroy saga connection correctly', async () => {
      await saga.onInit();
      await saga.onModuleDestroy();

      chai.expect(close.calledOnce).to.true;
    });

  });

  it('should start a new saga correctly', async () => {
    const result = await saga.start();
    chai.expect(result instanceof SagaProcess).to.be.true;
  });

});
