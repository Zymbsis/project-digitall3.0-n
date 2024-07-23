import createHttpError from 'http-errors';
<<<<<<< HEAD
import { ENV_VARS } from '../constants/index';
import { env } from './env';
=======
>>>>>>> 9394ce79bc5184fb30f37deeec2138b7cd75726b
import jwt from 'jsonwebtoken';

import { ENV_VARS } from '../constants/index.js';
import { env } from './env.js';

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Activation token expired or invalid');
    throw err;
  }
};
