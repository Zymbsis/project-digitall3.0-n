import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants';
import { env } from './env';
import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Activation token expired or invalid');
    throw err;
  }
};
