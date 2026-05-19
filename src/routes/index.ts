import { Router, Request, Response } from 'express';
import userRoutes from './user.routes.js';
import testeTelegramRoutes from './testeTelegram.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.use('/users', userRoutes);
router.use('/teste-login', testeTelegramRoutes);
router.use('/auth', authRoutes);

export default router;