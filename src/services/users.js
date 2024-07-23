import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { Water } from '../db/models/water.js';

import { getTokensData } from '../utils/handleTokens/getTokensData.js';
import { sendMail } from '../utils/handleMails/sendMail.js';
import { getLocalDateString } from '../utils/getLocalDateString.js';
import {
  getNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';
import { randomBytes } from 'crypto';
import { decodeToken } from '../utils/handleTokens/decodeToken.js';
import { verifyToken } from '../utils/handleTokens/verifyToken.js';
import { mailType } from '../constants/index.js';

// GOOGLE_OAUTH_2 //
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) {
    throw createHttpError(401);
  }

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);

    user = await UsersCollection.create({
      email: payload.email,
      name: getNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  return await SessionsCollection.create({
    userId: user._id,
    ...getTokensData(),
  });
};

// REGISTER_USER //
export const registerUser = async (payload) => {
  const isExistingUser = await UsersCollection.findOne({
    email: payload.email,
  });

  if (isExistingUser) {
    throw createHttpError(409, 'Email is already in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  sendMail(mailType.activation, user);
  return user;
};

// ACTIVATE_USER //
export const activateUser = async (token) => {
  const entries = verifyToken(token);

  const { sub: _id, email } = entries;

  const user = await UsersCollection.findOne({
    email,
    _id,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (user.activated) {
    throw createHttpError(
      409,
      'Account has already been activated. Please, sign in',
    );
  }

  await UsersCollection.findOneAndUpdate({ email, _id }, { activated: true });

  return await SessionsCollection.create({
    userId: user._id,
    ...getTokensData(),
  });
};

// LOGIN_USER //
export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Wrong password');
  }

  if (!user.activated) {
    throw createHttpError(404, 'Please, activate your account first.');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...getTokensData(),
  });
};

// LOGOUT_USER //
export const logoutUser = async (_id) => {
  await SessionsCollection.deleteOne({ _id });
};

// REFRESH_USER //
export const refreshUserSession = async (_id, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found. Please, sign in again');
  }

  const { userId } = session;

  return await SessionsCollection.create({ userId, ...getTokensData() });
};

// GET_CURRENT_USER //
export const getCurrentUser = async (_id) => {
  const user = await UsersCollection.findOne({ _id });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  return user;
};

// UPDATE_USER //
export const updateUser = async (_id, payload, options = {}) => {
  const user = await UsersCollection.findOne({ _id });

  const { dailyNorma: prevDailyNorma } = user;
  const { dailyNorma: newDailyNorma } = payload;

  const updatedUser = await UsersCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    ...options,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  if (prevDailyNorma !== newDailyNorma) {
    const today = getLocalDateString();

    await Water.updateMany(
      { userId: _id, date: today },
      { dailyNorma: newDailyNorma },
    );
  }

  return updatedUser;
};

// COUNT_USER //
export const getUsersCount = async () => await UsersCollection.countDocuments();

// REQUEST_ACTIVATION //
export const requestActivation = async (expiredActivationToken) => {
  const decodedToken = decodeToken(expiredActivationToken);
  const { email } = decodedToken;

  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (user.activated) {
    throw createHttpError(
      409,
      'Account has already been activated. Please, sign in',
    );
  }

  sendMail(mailType.activation, user);
};

// REQUEST_RESET_PASSWORD //
export const requestResetPassword = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found.');

  sendMail(mailType.resetPassword, user);
};

// RESET_PASSWORD //
export const resetPassword = async ({ token, password }) => {
  const entries = verifyToken(token);
  const { sub: _id, email } = entries;

  const user = await UsersCollection.findOne({ email, _id });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne({ _id }, { password: encryptedPassword });
};
