import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  getCurrentUser,
  updateUser,
  getUsersCount,
} from '../services/users.js';
import { setupSession } from '../utils/setupSession.js';

// import { requestResetToken } from '../services/auth.js';
// import { resetPassword } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const {
    cookies: { sessionId, refreshToken },
  } = req;
  console.log('sessionId =', sessionId);
  console.log('refreshToken =', refreshToken);
  console.log('cookies =', req.cookies);

  const session = await refreshUserSession(sessionId, refreshToken);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getCurrentUserController = async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  res.json({
    status: 200,
    message: 'Successfully retrieved user information!',
    data: user,
  });
};

export const updateUserController = async (req, res) => {
  const updatedUser = await updateUser(req.user._id, req.body);
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
