import { THIRTY_DAYS } from '../constants/index.js';

export const addCookies = (res, session) => {
  const { _id, refreshToken } = session;
  res.cookie('sessionId', _id, {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};
