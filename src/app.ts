import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config';
import { sync } from './controllers/sync';
import { requireDevice } from './middleware/device';

export const app = express();
app.disable('x-powered-by');
// Render sits behind a proxy: rate limits must see the real client IP.
app.set('trust proxy', 1);

// Kept exactly as it was: a college assignment checks this response.
app.get('/ping', cors(), (_req, res) => {
    res.json({ trocar_imagem: true });
});

const v2 = express.Router();
v2.use(cors({ origin: config.corsOrigins, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'X-Device-Id'], maxAge: 86400 }));
v2.use(rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente de novo em um minuto.' },
}));
v2.use(express.json({ limit: '256kb' }));

// Lets the app wake the server up (Render free plan) and check the database.
v2.get('/health', (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
v2.post('/sync', requireDevice, sync);

app.use('/v2', v2);

app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error: { status?: number; type?: string; message?: string }, _req: Request, res: Response, _next: NextFunction) => {
    const status = error.status ?? 500;
    if (status >= 500) console.error(error);
    const messages: Record<string, string> = {
        'entity.parse.failed': 'JSON inválido.',
        'entity.too.large': 'Requisição grande demais.',
    };
    const message = status >= 500 ? 'Erro interno. Tente novamente.' : (error.type && messages[error.type]) || error.message;
    res.status(status).json({ error: message });
});
