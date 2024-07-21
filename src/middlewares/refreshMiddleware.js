import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { removeCookies } from '../utils/removeCookies.js';

export const refreshMiddleware = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please, provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Authorization header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found. Please, sign in'));
    return;
  }

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    SessionsCollection.findOneAndDelete({
      _id: session._id,
      refreshToken: session.refreshToken,
    });

    removeCookies(res);

    res.status(401).json({
      status: 401,
      message: 'Session has expired. Please, sign in.',
      data: {},
    });
  }

  next();
};
