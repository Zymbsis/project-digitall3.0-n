import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const newSessionObject = {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    // accessTokenValidUntil: new Date(Date.now() + 10000),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
  const newSession = await SessionsCollection.create(newSessionObject);

  return newSession;
};
