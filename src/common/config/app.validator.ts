import * as Joi from 'joi';

export const appValidator = Joi.object({
  PORT: Joi.number().positive().integer().default(5757),
  // prisma
  DATABASE_URL: Joi.string().required(),
  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_EXPIRES_IN_REFRESH: Joi.string().required(),
  // sendgrid
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().email().required(),
  SENDGRID_WELCOME_MAIL_TEMPLATE_ID: Joi.string().required(),
});
