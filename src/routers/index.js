import { Router } from 'express';
import authRouter from './users.js';

const router = Router();

router.use('/users', authRouter);

export default router;
