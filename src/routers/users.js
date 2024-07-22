import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getCurrentUserController,
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  updateUserController,
  logoutUserController,
  getUsersCountController,
  activateUserController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/users.js';

import {
  activateUserSchema,
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validateSession } from '../middlewares/validateSession.js';

// import { requestResetEmailSchema } from '../validation/auth.js';
// import { requestResetEmailController } from '../controllers/auth.js';
// import { resetPasswordSchema } from '../validation/auth.js';
// import { resetPasswordController } from '../controllers/auth.js';

const router = Router();

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));

router.post(
  '/refresh',
  authenticate,
  validateSession,
  ctrlWrapper(refreshUserSessionController),
);

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/update',
  authenticate,
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.get('/count', getUsersCountController);

router.post(
  '/activate',
  validateBody(activateUserSchema),
  ctrlWrapper(activateUserController),
);

// router.post(
//   '/send-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// router.post(
//   '/reset-pwd',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );

export default router;
