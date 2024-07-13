import { Router } from 'express';
import {
  addPortionController,
  deletePortionController,
  getAllPortionsController,
  getPortionsByDayController,
  getPortionsByMonthController,
  patchPortionController,
} from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateId } from '../middlewares/validateId.js';
import { validateDate } from '../middlewares/validateDate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addPortionSchema, patchPortionSchema } from '../validation/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.get('/', ctrlWrapper(getAllPortionsController));

waterRouter.post(
  '/',
  validateBody(addPortionSchema),
  ctrlWrapper(addPortionController),
);

waterRouter.patch(
  '/:id',
  validateId('id'),
  validateBody(patchPortionSchema),
  ctrlWrapper(patchPortionController),
);

waterRouter.delete(
  '/:id',
  validateId('id'),
  ctrlWrapper(deletePortionController),
);

waterRouter.get(
  '/day/:date',
  validateDate('date'),
  ctrlWrapper(getPortionsByDayController),
);

waterRouter.get(
  '/month/:date',
  validateDate('date'),
  ctrlWrapper(getPortionsByMonthController),
);

export default waterRouter;
