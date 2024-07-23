import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../constants/index.js';
import { env } from './env.js';

export const encodeToken = (id, email) => {
  return jwt.sign({ sub: id, email }, env(ENV_VARS.JWT_SECRET), {
    expiresIn: '10m',
  });
};
