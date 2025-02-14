import * as Joi from 'joi';

export const validationConfig = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development', 
    'certification', 
    'production'
  ).default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  PORT: Joi.number().default(3000),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_SYNCHRONIZE: Joi.bool().required(),
  CRYPTO_KEY: Joi.string().required()
});