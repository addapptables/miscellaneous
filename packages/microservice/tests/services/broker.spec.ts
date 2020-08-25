import * as chai from 'chai';
import * as sinon from 'sinon';
import { Broker } from '../../src/services/broker/broker';

describe('Broker', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Broker['instance'] = undefined;
  });

  it('should Broker getInstance', () => {
    const saga = Broker.getInstance();
    chai.expect(saga instanceof Broker).to.be.true;
  });

  it('should get an element', () => {
    const saga = Broker.getInstance();
    const get = sandbox.spy(saga['sagas'], 'get');

    saga.add('0c8374b3-32cc-41b3-8dfe-e1570b554e6d', () => { });
    const callback = saga.get('0c8374b3-32cc-41b3-8dfe-e1570b554e6d');

    chai.expect(typeof callback).to.be.equal('function');
    chai.expect(get.calledOnce).to.be.true;

    get.restore();
  });

  it('should add an element', () => {
    const saga = Broker.getInstance();
    const set = sandbox.spy(saga['sagas'], 'set');
    saga.add('0c8374b3-32cc-41b3-8dfe-e1570b554e6d', () => { });

    const [cid, callback] = set.getCall(0).args;

    chai.expect(set.calledOnce).to.be.true;
    chai.expect(typeof callback).to.be.equal('function');

    set.restore();
  });

  it('should delete an element', () => {
    const saga = Broker.getInstance();
    const remove = sandbox.spy(saga['sagas'], 'delete');
    saga.add('0c8374b3-32cc-41b3-8dfe-e1570b554e6d', () => { });

    saga.delete('0c8374b3-32cc-41b3-8dfe-e1570b554e6d');

    const [cid] = remove.getCall(0).args;

    chai.expect(remove.calledOnce).to.be.true;

    remove.restore();
  });

});
