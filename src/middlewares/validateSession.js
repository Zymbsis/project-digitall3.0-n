import { SessionsCollection } from '../db/models/session.js';

export const validateSession = async (req, res, next) => {
  const {
    cookies: { sessionId: _id, refreshToken },
  } = req;

  const session = SessionsCollection.findOne({ _id, refreshToken });

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    await SessionsCollection.findOneAndDelete({ _id, refreshToken });
    throw createHttpError(401, 'Session token expired');
  }

  next();
};
