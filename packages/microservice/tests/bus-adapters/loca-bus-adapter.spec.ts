import * as chai from 'chai';
import { LocalBusAdapter } from '../../src/bus-adapters/local-bus.adapter';
import { CraftsLoggerMock } from '../mocks/crafts-logger.mock';

describe('local bus adapter', () => {

    const testData = {
        action: 'test-action',
        context: 'test-context',
        data: { id: '' },
    };

    let localAdapter: LocalBusAdapter;

    before(() => {
        localAdapter = new LocalBusAdapter(new CraftsLoggerMock({}));
        localAdapter.onInit();
    })

    after(() => {
        localAdapter.close();
    })

    it('Should keep singleton instance when creating a new adapter', () => {
        const secondInstance = new LocalBusAdapter(new CraftsLoggerMock({}));
        chai.expect(secondInstance).to.be.equal(localAdapter);
    })

    it('Should support setOptions without params', () => {
        chai.expect(() => localAdapter.setOptions()).to.not.throw();
    })

    describe('Subscribe', () => {
        it('Should be equal to test-context', (done) => {
            localAdapter.subscribe((result) => {
                chai.expect(result.context).to.be.equal(testData.context);
                done();
            }, testData);
            localAdapter.publish(testData);
        })

        it('Should not execute', (done) => {
            localAdapter.subscribe(() => {
                throw 'It should not entry here';
            }, testData);
            localAdapter.publish({ ...testData, context: 'other-context' });
            setTimeout(() => {
                done();
            }, 500);
        })

        it('Should throw a exception', (done) => {
            const data = { ...testData, context: 'test-exception' };
            localAdapter.subscribe(() => {
                try {
                    throw 'Exception';
                } catch (error) {
                    chai.expect(error).to.be.equal('Exception');
                    done();
                }
            }, data);
            localAdapter.publish(data);
        })

        it('Should be called twice', (done) => {
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

        it('Should process one by one when sequential processing is enabled', (done) => {
            const data = { ...testData, action: 'sequential-action', context: 'sequential-context' };
            const executionOrder = [];
            let processed = 0;

            localAdapter.setOptions({ sequentialProcessing: true });

            localAdapter.subscribe(async (result) => {
                executionOrder.push(`start-${result.data.id}`);
                await new Promise((resolve) => setTimeout(resolve, 20));
                executionOrder.push(`end-${result.data.id}`);
                processed++;

                if (processed === 3) {
                    chai.expect(executionOrder).to.be.deep.equal([
                        'start-1',
                        'end-1',
                        'start-2',
                        'end-2',
                        'start-3',
                        'end-3'
                    ]);
                    localAdapter.setOptions({ sequentialProcessing: false });
                    done();
                }
            }, data);

            localAdapter.publish({ ...data, data: { id: '1' } });
            localAdapter.publish({ ...data, data: { id: '2' } });
            localAdapter.publish({ ...data, data: { id: '3' } });
        })

        it('Should not run handles concurrently across subscriptions when sequential processing is enabled', (done) => {
            const data = {
                ...testData,
                action: 'sequential-global-action',
                context: 'sequential-global-context',
            };
            let running = 0;
            let maxRunning = 0;
            let processed = 0;

            localAdapter.setOptions({ sequentialProcessing: true });

            const createHandler = () => async () => {
                running++;
                maxRunning = Math.max(maxRunning, running);
                await new Promise((resolve) => setTimeout(resolve, 20));
                running--;
                processed++;

                if (processed === 4) {
                    chai.expect(maxRunning).to.be.equal(1);
                    localAdapter.setOptions({ sequentialProcessing: false });
                    done();
                }
            };

            localAdapter.subscribe(createHandler(), data);
            localAdapter.subscribe(createHandler(), data);

            localAdapter.publish({ ...data, data: { id: '1' } });
            localAdapter.publish({ ...data, data: { id: '2' } });
        })
    })
});