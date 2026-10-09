import { createHash } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

declare global {
    namespace Express {
        interface Request {
            owner?: string;
        }
    }
}

export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);

// Every /v2 call carries the device's secret ID; its tasks are stored under the ID's hash.
export const requireDevice = (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.get('X-Device-Id');
    if (!isUuid(deviceId)) {
        res.status(401).json({ error: 'Envie o cabeçalho X-Device-Id com um UUID válido.' });
        return;
    }
    req.owner = createHash('sha256').update(deviceId.toLowerCase()).digest('hex');
    next();
};
