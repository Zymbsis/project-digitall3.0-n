import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/index.js';
import { env } from './env.js';
import jwt from 'jsonwebtoken';

export const decodeToken = (token) => {
  try {
    return jwt.decode(token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Invalid or damaged token.');
    throw error;
  }
};
