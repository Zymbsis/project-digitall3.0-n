import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  getCurrentUser,
  updateUser,
  getUsersCount,
  activateUser,
  requestActivation,
} from '../services/users.js';
import { addCookies } from '../utils/addCookies.js';
import { env } from '../utils/env.js';
import { removeCookies } from '../utils/removeCookies.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

// import { requestResetToken } from '../services/auth.js';
// import { resetPassword } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const { body } = req;
  const user = await registerUser(body);
  // await requestActivation(user.email);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const activateUserController = async (req, res) => {
  const {
    body: { token },
  } = req;

  const session = await activateUser(token);
  const { accessToken } = session;

  addCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully activated and logged in a user!',
    data: { accessToken },
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;

  const session = await loginUser(body);
  const { accessToken } = session;

  addCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const {
    cookies: { sessionId },
  } = req;

  if (sessionId) {
    await logoutUser(sessionId);
  }

  removeCookies(res);

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res, next) => {
  const {
    cookies: { sessionId, refreshToken },
  } = req;

  const session = await refreshUserSession(sessionId, refreshToken);
  const { accessToken } = session;

  addCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const getCurrentUserController = async (req, res) => {
  const {
    user: { _id: userId },
  } = req;

  const currentUser = await getCurrentUser(userId);

  res.json({
    status: 200,
    message: 'Successfully retrieved user information!',
    data: currentUser,
  });
};

export const updateUserController = async (req, res) => {
  const {
    user: { _id: userId },
    body,
    file,
  } = req;

  let avatar;
  if (file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatar = await saveFileToCloudinary(file);
    } else {
      avatar = await saveFileToUploadDir(file);
    }
  }
  const updatedUser = await updateUser(userId, { ...body, avatar });

  res.json({
    status: 200,
    message: 'User data updated successfully!',
    data: updatedUser,
  });
};

export const getUsersCountController = async (req, res) => {
  const count = await getUsersCount();

  res.json({
    status: 200,
    message: 'Successfully counted all registered users.',
    data: { count },
  });
};

export const requestActivationController = async (req, res) => {
  const {
    body: { email },
  } = req;

  await requestActivation(email);

  res.json({
    status: 200,
    message: 'Activation link has been successfully sent.',
    data: {},
  });
};

// export const requestResetEmailController = async (req, res) => {
//   await requestResetToken(req.body.email);
//   res.json({
//     status: 200,
//     message: 'Reset password email has been successfully sent.',
//     data: {},
//   });
// };

// export const resetPasswordController = async (req, res) => {
//   await resetPassword(req.body);
//   res.json({
//     status: 200,
//     message: 'Password was successfully reset.',
//     data: {},
//   });
// };
