import { Router, Request, Response } from 'express';
import userRoutes from './users.routes.js';
import testeTelegramRoutes from './testeTelegram.routes.js';
import authRoutes from './auth.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.use('/teste-login', testeTelegramRoutes);
router.use('/auth', authRoutes);
router.use(authMiddleware)

router.use('/users', userRoutes);



export default router;