import 'dotenv/config';
import * as joi from 'joi';

interface Env {
    PORT: number;
    NATS_SERVERS: string[];
}

const envSchema = joi.object<Env>({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',').map(server => server.trim()),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    port: value.PORT,
    natsServers: value.NATS_SERVERS,
}
