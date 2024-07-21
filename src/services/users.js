import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { Water } from '../db/models/water.js';
import { getTokensData } from '../utils/getTokensData.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/index.js';
import { getMailTemplate } from '../utils/getMailTemplate.js';
import { sendMail } from '../utils/sendMail.js';
import { getLocalDateString } from '../utils/getLocalDateString.js';

// import { TEMPLATES_DIR } from '../constants/index.js';
// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { ctrlWrapper } from '../utils/ctrlWrapper.js';

//REGISTER_USER//
export const registerUser = async (payload) => {
  const isExistingUser = await UsersCollection.findOne({
    email: payload.email,
  });
  if (isExistingUser) {
    throw createHttpError(409, 'Email is already in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const activateUser = async (token) => {
  let entries;

  try {
    entries = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Activation token is expired or invalid.');
    throw err;
  }

  const { sub: _id, email } = entries;

  const user = await UsersCollection.findOne({
    email,
    _id,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (user.activated) {
    return await SessionsCollection.create({
      userId: user._id,
      ...getTokensData(),
    });
  }

  const activatedUser = await UsersCollection.findOneAndUpdate(
    { email, _id },
    { activated: true },
    { new: true },
  );

  return await SessionsCollection.create({
    userId: activatedUser._id,
    ...getTokensData(),
  });
};

//LOGIN_USER//
export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Wrong password');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...getTokensData(),
  });
};

//LOGOUT_USER//
export const logoutUser = async (_id) => {
  await SessionsCollection.deleteOne({ _id });
};

//REFRESH_USER//

export const refreshUserSession = async (_id, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found. Please, sign in again.');
  }

  const { userId } = session;

  return await SessionsCollection.create({ userId, ...getTokensData() });
};

//GET_CURRENT_USER//
export const getCurrentUser = async (_id) => {
  const user = await UsersCollection.findOne({ _id });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  return user;
};

//UPDATE_USER//
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

export const getUsersCount = async () => await UsersCollection.countDocuments();

export const requestActivation = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found.');
  }

  const activationToken = jwt.sign(
    { sub: user._id, email },
    env(ENV_VARS.JWT_SECRET),
    { expiresIn: '10m' },
  );

  const domain = env(ENV_VARS.APP_DOMAIN);
  const link = `${domain}/project-digitall3.0-r/activation?token=${activationToken}`;
  const template = await getMailTemplate('activation-mail.html');
  const html = template({ name: user.name, link });

  try {
    await sendMail({
      from: env(ENV_VARS.SMTP_FROM),
      to: email,
      subject: 'AquaTracker: Activate your account now!',
      html,
    });
  } catch (error) {
    console.error(error);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

// export const requestResetToken = async (email) => {
//   const user = await UsersCollection.findOne({ email });

//   if (!user) throw createHttpError(404, 'User not found.');

//   const resetToken = jwt.sign(
//     { sub: user._id, email },
//     env(ENV_VARS.JWT_SECRET),
//     {
//       expiresIn: '15m',
//     },
//   );
//   const domain = env(ENV_VARS.APP_DOMAIN);
//   const { name } = user;
//   const link = `${domain}/auth/reset-password?token=${resetToken}`;

//   const template = await getMailTemplate('reset-password-mail.html');
//   const html = template({ name, link });

//   try {
//     await sendMail({
//       from: env(ENV_VARS.SMTP_FROM),
//       to: email,
//       subject: 'Reset your password / Contacts App',
//       html,
//     });
//     console.log('resetToken : ', resetToken);
//   } catch (error) {
//     console.error(error);

//     throw createHttpError(
//       500,
//       'Failed to send the email, please try again later.',
//     );
//   }
// };

// export const resetPassword = async (payload) => {
//   let entries;

//   try {
//     entries = jwt.verify(payload.token, env('JWT_SECRET'));
//   } catch (err) {
//     if (err instanceof Error)
//       throw createHttpError(401, 'Token is expired or invalid.');
//     throw err;
//   }

//   const user = await UsersCollection.findOne({
//     email: entries.email,
//     _id: entries.sub,
//   });

//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }

//   const encryptedPassword = await bcrypt.hash(payload.password, 10);

//   await UsersCollection.updateOne(
//     { _id: user._id },
//     { password: encryptedPassword },
//   );
// };
