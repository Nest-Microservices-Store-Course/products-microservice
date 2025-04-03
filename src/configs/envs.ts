import 'dotenv/config';
import * as joi from 'joi';

interface Env {
    PORT: number;
    DATABASE_URL: string;
}

const envSchema = joi.object<Env>({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    port: value.PORT,
}
