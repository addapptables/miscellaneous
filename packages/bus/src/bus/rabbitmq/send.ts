import * as R from 'ramda';
import { queueOpts, publishOpts } from './config/default';

const queueDefault = R.mergeDeepRight(queueOpts);
const publishDefault = R.mergeDeepRight(publishOpts);

export const send = (channel, busOpts) => (queue: string, payload: any, opts?: any): any => {
    opts = opts || {};
    const messageBuffer = new Buffer(JSON.stringify(payload));

    return channel.assertQueue(queue, queueDefault(opts.queue || {}))
        .then(() => channel.sendToQueue(queue, messageBuffer, publishDefault(opts.publish || {})));
};
