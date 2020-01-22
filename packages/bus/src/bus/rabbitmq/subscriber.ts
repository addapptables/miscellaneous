import { mergeDeepRight, or } from 'ramda';
import { exchangeOpts, queueOpts, subscribeOpts, prefetch } from './config/default';

const decorate = (channel, handler) => message => handler(message, () => channel.ack(message), () => channel.nack(message));

const exchangeDefault = mergeDeepRight(exchangeOpts);
const queueDefault = mergeDeepRight(queueOpts);
const subscribeDefault = mergeDeepRight(subscribeOpts);

export const subscriber = (channel, busOpts) => (action: string, handler: (msg, ack, nack) => void, context?: string, opts?: any): any => {
    opts = or(opts || {});
    const exchange = or(context, busOpts.exchange);
    const service = or(opts.service, busOpts.service)
    const queue = `${service}.${exchange}.${action}`;
    const type = or(opts.type, 'topic');

    channel.prefetch(or(opts.prefetch, prefetch));

    return channel.assertExchange(exchange, type, exchangeDefault(opts.exchange || {}))
        .then(() => channel.assertQueue(queue, queueDefault(opts.queue || {})))
        .then(() => channel.bindQueue(queue, exchange, action))
        .then(() => channel.consume(queue, decorate(channel, handler), subscribeDefault(opts.subscribe || {})));
};
