import { Logger } from '@nestjs/common';
import { Consumer, Producer } from '@nestjs/common/interfaces/external/kafka-options.interface';
import * as uuid from 'uuid/v4';
import { IBusAdapter } from '../interfaces/bus/bus-adapter.interface';
import { ITransferData } from '../interfaces/transfer-data';
import { TransferDataDto } from '../interfaces/transfer-data-dto.interface';
import { IOnInit } from '../interfaces/lifecycles';
import { ISetOptions } from '../interfaces/set-options.interface';
import { loadPackage } from '../utils/load-package.util';
import { KAFKA_DEFAULT_CLIENT, KAFKA_DEFAULT_GROUP, KAFKA_DEFAULT_BROKER } from '../config/constants.config';

let kafkaPackage: any = {};

export class KafkaBusAdapter implements IBusAdapter, IOnInit, ISetOptions {

    private options: any = {};
    private consumer: Consumer;
    private producer: Producer;
    private handles: Map<string, Function>;
    private readonly logger: Logger;

    constructor() {
        this.handles = new Map();
        this.logger = new Logger(KafkaBusAdapter.name);
        kafkaPackage = loadPackage('kafkajs', KafkaBusAdapter.name, () =>
            require('kafkajs')
        );
    }

    setOptions(options: any): void {
        this.options = options;
    }

    async onInit(): Promise<void> {
        const clientId = (this.options.clientId || KAFKA_DEFAULT_CLIENT) + '-client';
        const brokers = this.options.brokers || [KAFKA_DEFAULT_BROKER];
        const groupId = (this.options?.groupId || KAFKA_DEFAULT_GROUP) + '-client';

        const kafka = new kafkaPackage.Kafka(
            Object.assign(this.options.client || {}, {
                clientId: clientId,
                brokers: brokers,
            }));

        this.producer = kafka.producer(this.options.producer || {});
        this.consumer = <Consumer>kafka.consumer(this.options.consumer || { groupId });

        await this.producer.connect();
        await this.consumer.connect();
    }

    async publish(data: ITransferData<TransferDataDto>): Promise<void> {
        const topic = `${data.context}-${data.action}`;
        await this.producer.send({
            topic,
            messages: [
                { value: JSON.stringify(data) },
            ],
        });
        this.logger.debug({ ...data, sendData: true }, data.context);
    }

    async subscribe(handle: Function, data: ITransferData<TransferDataDto>): Promise<void> {
        const topic = `${data.context}-${data.action}`;
        data.cid = data.cid || uuid();
        this.handles.set(data.cid, handle);
        await this.consumer.stop();
        await this.consumer.subscribe({ topic, fromBeginning: true });
        await this.listenMessages();
    }

    private async listenMessages() {
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const msg = <ITransferData<TransferDataDto>>JSON.parse(message.value.toString());
                try {
                    const handle = this.handles.get(msg.cid);
                    await handle(msg);
                    this.logger.debug({ ...msg, receivedData: true }, msg.context);
                } catch (error) {
                    this.logger.error({ message: error.message, msg }, KafkaBusAdapter.name, msg.context);
                }
            },
        });
    }

    async close() {
        await this.consumer.stop();
        await this.consumer.disconnect();
        await this.producer.disconnect();
    }

}
