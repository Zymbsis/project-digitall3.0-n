import { Router } from 'express';
import {
  addWaterIntakeController,
  deleteWaterIntakeController,
  getAllWaterIntakesController,
  getInfoByDayController,
  getInfoByMonthController,
  patchWaterIntakeController,
} from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateId } from '../middlewares/validateId.js';
import { validateDate } from '../middlewares/validateDate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addWaterIntakeSchema,
  patchWaterIntakeSchema,
} from '../validation/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.get('/', ctrlWrapper(getAllWaterIntakesController));

waterRouter.post(
  '/',
  validateBody(addWaterIntakeSchema),
  ctrlWrapper(addWaterIntakeController),
);

waterRouter.patch(
  '/:id',
  validateId('id'),
  validateBody(patchWaterIntakeSchema),
  ctrlWrapper(patchWaterIntakeController),
);

waterRouter.delete(
  '/:id',
  validateId('id'),
  ctrlWrapper(deleteWaterIntakeController),
);

waterRouter.get(
  '/day/:date',
  validateDate('date'),
  ctrlWrapper(getInfoByDayController),
);

waterRouter.get(
  '/month/:date',
  validateDate('date'),
  ctrlWrapper(getInfoByMonthController),
);

export default waterRouter;
