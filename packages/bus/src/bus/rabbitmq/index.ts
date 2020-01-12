import * as amqp from 'amqplib';
import * as R from 'ramda';
import { IBus } from '../../interfaces/bus.interface';
import { IBusRabbitMQOptions } from './interfaces/bus-options.interface';
import { subscriber } from './subscriber';
import { publisher } from './publisher';
import { send } from './send';

const connection = async (host): Promise<amqp.Connection> => await amqp.connect(host);

const createChannels = (connection: amqp.Connection) => Promise.all([
    connection.createChannel(),
    connection.createChannel(),
]);

const closeConnection = (connection) => R.bind(connection.close, connection);

export const createBus = (opts: IBusRabbitMQOptions): Promise<IBus> => connection(opts.host)
    .then<any>(async connection => ([connection, await createChannels(connection)]))
    .then(([connection, [pubChannel, subChannel]]) => ({
        publish: publisher(pubChannel, opts),
        subscribe: subscriber(subChannel, opts),
        send: send(subChannel, opts),
        close: closeConnection(connection),
    }));

