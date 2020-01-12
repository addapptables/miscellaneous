export const prefetch = 1;

export const queueOpts = {
    durable: true,
    autoDelete: false,
    exclusive: false,
};

export const exchangeOpts = {
    durable: true,
    autoDelete: false,
};

export const publishOpts = {
    persistent: true,
};

export const subscribeOpts = {
    noAck: false,
    exclusive: false,
};
