import * as Joi from 'joi';

export const appValidator = Joi.object({
  PORT: Joi.number().positive().integer().default(5757),
  // prisma
  DATABASE_URL: Joi.string().required(),
  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
