import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                telegramId: number;
                username?: string;
                context: string;
            };
        }
    }
}
