import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, updateUserSchema } from '../validation/users.js';
import {
  getCurrentUserController,
  registerUserController,
  updateUserController,
  getUsersCountController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/users.js';
import { loginUserController } from '../controllers/users.js';
import { logoutUserController } from '../controllers/users.js';
import { refreshUserSessionController } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/uploadMiddleware.js';

// import { requestResetEmailSchema } from '../validation/auth.js';
// import { requestResetEmailController } from '../controllers/auth.js';
// import { resetPasswordSchema } from '../validation/auth.js';
// import { resetPasswordController } from '../controllers/auth.js';

const router = Router();

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

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/update',
  authenticate,
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.get('/count', getUsersCountController);

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
