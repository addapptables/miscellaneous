import * as chai from 'chai';
import * as sinon from 'sinon';
import { head } from 'ramda';
import { SagaProcess } from '../../src/services/saga/saga-process';
import { Saga } from '../../src/services/saga/saga';
import { IBusAdapter } from '../../src/interfaces';

describe('Saga process', () => {

  let sagaProcess: SagaProcess;
  let adapter = {};

  beforeEach(() => {
    adapter = { publish(data: any, options?: any) { } }
    sagaProcess = new SagaProcess(<IBusAdapter>adapter);
  });

  it('should the saga process be initialized correctly', () => {
    sagaProcess['getCid'] = function () { return this.cid; }
    const cid = sagaProcess['getCid']();
    cid.should.be.a.uuid('v4');
    sagaProcess['getCid'] = null;
  });

  it('should start the process adding data inside saga process', () => {
    const data = {
      context: 'test', action: 'createTest', data: { id: '1f558dcd-e8f4-400c-bc3d-71f7107d8fbb' },
    };
    sagaProcess['getData'] = function () { return this.data; }

    const process = sagaProcess.add(data);
    chai.expect(process instanceof SagaProcess).to.be.true;
    chai.expect(sagaProcess['getData']()).to.be.equal(data);

    sagaProcess['getData'] = null;
  });

  it('should finish saga process publishing message', async () => {
    const sandbox = sinon.createSandbox();
    const data = { context: 'test', action: 'createTest', data: { id: '' } };
    const cid = sagaProcess['cid'];
    sagaProcess['data'] = data;

    const add = sandbox.spy(Saga.getInstance(), 'add');
    const publish = sandbox.stub(<any>adapter, 'publish').callsFake(async (data) => {
      const callback = Saga.getInstance().get(cid);
      await callback(data);
    });

    await sagaProcess.end();

    chai.expect(add.getCall(0).args[0]).to.be.equal(cid);
    chai.expect(typeof add.getCall(0).args[1]).to.be.equal('function');
    chai.expect(add.calledOnce).to.be.true;
    chai.expect(publish.calledOnce).to.be.true;
    chai.expect(head(publish.getCall(0).args)).deep.equals({ ...data, cid });

    sandbox.restore();

    const instance = Saga.getInstance();
    instance['sagas'] = undefined;
    Saga['instance'] = undefined;
  });

});
