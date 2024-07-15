import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
// import { TEMPLATES_DIR } from '../constants/index.js';
// import jwt from 'jsonwebtoken';
// import { SMTP } from '../constants/index.js';
// import { env } from '../utils/env.js';
// import { sendEmail } from '../utils/sendMail.js';
// import handlebars from 'handlebars';
// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { ctrlWrapper } from '../utils/ctrlWrapper.js';

//REGISTER_USER//
export const registerUser = async (payload) => {
  const { email, password } = payload;
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return newUser;
};

//LOGIN_USER//
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Wrong password');
  }
  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);
  console.log('newSession =', newSession);

  return newSession;
};

//LOGOUT_USER//
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

//REFRESH_USER//
export const refreshUserSession = async (_id, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found, refresh error');
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionsCollection.deleteOne({ _id, refreshToken });
  const newSession = await createSession(session.userId);

  return newSession;
};

//GET_CURRENT_USER//
export const getCurrentUser = async (userId) => {
  const user = await UsersCollection.findById(userId).select('-password');
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  return user;
};

//UPDATE_USER//
export const updateUser = async (_id, payload, options = {}) => {
  const updatedUser = await UsersCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    ...options,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;
};

// export const requestResetToken = ctrlWrapper(async (email) => {
//   const user = await UsersCollection.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }

//   const resetToken = jwt.sign(
//     {
//       sub: user._id,
//       email,
//     },
//     env('JWT_SECRET'),
//     {
//       expiresIn: '5m',
//     },
//   );

//   const resetPasswordLink = `${env(
//     'APP_DOMAIN',
//   )}/reset-password?token=${resetToken}`;

//   await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html: `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password!</p>`,
//   });

//   const resetPasswordTemplatePath = path.join(
//     TEMPLATES_DIR,
//     'reset-password-email.html',
//   );

//   const templateSource = (
//     await fs.readFile(resetPasswordTemplatePath)
//   ).toString();

//   const template = handlebars.compile(templateSource);
//   const html = template({
//     name: user.name,
//     link: resetPasswordLink,
//   });

//   await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html,
//   });
// });

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

export const getUsersCount = async () => await UsersCollection.countDocuments();
