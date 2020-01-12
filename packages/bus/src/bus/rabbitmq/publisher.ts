import { mergeDeepRight, or } from 'ramda';
import { exchangeOpts, publishOpts } from './config/default';

const exchangeDefault = mergeDeepRight(exchangeOpts);
const publishDefault = mergeDeepRight(publishOpts);

export const publisher = (channel, busOpts) => (action: string, payload: any, context?: string, opts?: any): any => {
    opts = or(opts || {});
    const exchange = or(context, busOpts.exchange);
    const type = or(opts.type, 'topic');

    return channel.assertExchange(exchange, type, exchangeDefault(opts.exchange || {}))
        .then(() => channel.publish(
            exchange,
            action,
            new Buffer(JSON.stringify(payload)),
            publishDefault(opts.publish || {})
        ));
};
