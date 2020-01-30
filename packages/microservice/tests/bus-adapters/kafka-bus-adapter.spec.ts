import { before } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { KafkaBusAdapter } from '../../src/bus-adapters/kafka-bus.adapter';
import { IBusAdapter } from '../../src/interfaces/bus/bus-adapter.interface';
import * as loadPackage from '../../src/utils/load-package.util';
import { Kafka } from './mocks/kafkajs.mock';

describe('kafka bus adapter', function () {

    const testData = {
        action: 'test-action',
        context: 'test-context',
        data: { id: '' },
    };

    let kafkaAdapter: IBusAdapter;

    describe('Subscribe', () => {

        before(async () => {
            sinon.stub(loadPackage, 'loadPackage').returns({ Kafka });
            const adapter = new KafkaBusAdapter();
            await adapter.onInit();
            kafkaAdapter = adapter;
        })

        after(async () => {
            await kafkaAdapter.close();
        })

        it('Should be equal to test-context', () => {
            return new Promise(async (resolve, reject) => {
                await kafkaAdapter.subscribe(async (result) => {
                    try {
                        chai.expect(result.context).to.be.equal(testData.context);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }, testData);
                await kafkaAdapter.publish(testData);
            })
        })

        it('Should throw a exception', () => {
            return new Promise(async (resolve) => {
                await kafkaAdapter.subscribe(async () => {
                    try {
                        throw 'Exception';
                    } catch (error) {
                        chai.expect(error).to.be.equal('Exception');
                        resolve(error);
                    }
                }, testData);
                await kafkaAdapter.publish(testData);
            })
        })
    })
});