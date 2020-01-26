import { LocalBusAdapter } from '../../src/bus-adapters/local-bus.adapter';
import { IBusAdapter } from '../../src/interfaces/bus/bus-adapter.interface';
import * as chai from 'chai';

describe('local bus adapter', () => {

    const testData = {
        action: 'test-action',
        context: 'test-context',
        data: { id: '' },
    };

    let localAdapter: IBusAdapter;

    beforeEach(() => {
        localAdapter = new LocalBusAdapter();
    })

    it('Subscribe result should be equal to test-context', (done) => {
        localAdapter.subscribe((result) => {
            chai.expect(result.context).to.be.equal(testData.context);
            done();
        }, testData);
        localAdapter.publish(testData);
    })

    it('The function subscribe should not execute', (done) => {
        localAdapter.subscribe(() => {
            throw 'It should not entry here';
        }, testData);
        localAdapter.publish({ ...testData, context: 'other-context' });
        setTimeout(() => {
            done();
        }, 500);
    })

    it('The function subscribe throw a exception', (done) => {
        const data = { ...testData, context: 'test-exception' };
        localAdapter.subscribe(() => {
            try {
                throw 'Exception';
            } catch (error) {
                done();
            }
        }, data);
        localAdapter.publish(data);
    })

    it('The function subscribe should be called twice', (done) => {
        const data = { ...testData, context: 'twice' };
        let counter = 0;
        localAdapter.subscribe(() => {
            counter++;
            if (counter > 1) {
                done();
            }
        }, data);
        localAdapter.subscribe(() => {
            counter++;
            if (counter > 1) {
                done();
            }
        }, data);
        localAdapter.publish(data);
    })

    afterEach(() => {
        localAdapter.close();
    })

});