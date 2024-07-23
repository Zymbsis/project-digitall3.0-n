import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

import { env } from './env.js';
import { ENV_VARS } from '../constants/index.js';
import { getMailTemplate } from './getMailTemplate.js';
import { encodeToken } from './encodeToken.js';

const transporter = nodemailer.createTransport({
  host: env(ENV_VARS.SMTP_HOST),
  port: Number(env(ENV_VARS.SMTP_PORT)),
  auth: { user: env(ENV_VARS.SMTP_USER), pass: env(ENV_VARS.SMTP_PASSWORD) },
});

export const sendMail = async (mailType, user) => {
  const { _id, email, name } = user;

  const token = encodeToken(_id, email);

  const domain = env(ENV_VARS.APP_DOMAIN);
  const from = env(ENV_VARS.SMTP_FROM);
  const link = `${domain}/project-digitall3.0-r/${mailType}?token=${token}`;
  const template = await getMailTemplate(`${mailType}-mail.html`);
  const html = template({ name, link });
  const subject = `AquaTracker: Your ${mailType.replaceAll(
    '-',
    ' ',
  )} link is here!`;

  try {
    await transporter.sendMail({
      to: email,
      from,
      subject,
      html,
    });
  } catch (error) {
    console.error(error);

    throw createHttpError(
      500,
      'Failed to send the email, please, try again later',
    );
  }
};
