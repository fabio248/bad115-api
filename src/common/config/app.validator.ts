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
  SENDGRID_UNBLOCK_USER_MAIL_TEMPLATE_ID: Joi.string().required(),
  SENDGRID_SEND_CONFIRMATION_MEETING: Joi.string().required(),
  // aws
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET: Joi.string().required(),
});
