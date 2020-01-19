import { mapSeries } from 'bluebird';
import * as amqp from 'amqplib';

export const subscribeAll = (options: any) => async (handler: Function): Promise<void> => {
  const queue = `${options.service}.${options.context}.saga-${process.pid}`;
  const connection = await amqp.connect(options.host);
  const subChannel = await connection.createChannel();

  await subChannel.assertQueue(queue, {
    autoDelete: true,
    durable: true,
    messageTtl: 60000,
    deadLetterExchange: options.context,
    deadLetterRoutingKey: 'saga-errors',
  });

  await mapSeries(options.events, ({ action, context }) => subChannel.bindQueue(queue, context, action));
  await subChannel.consume(queue, handler(subChannel));
};