import { Request, Response } from 'express';
import { AnyBulkWriteOperation } from 'mongoose';
import { config } from '../config';
import { isUuid } from '../middleware/device';
import { Task, TaskDoc } from '../models/Task';

type Change = {
    id: string;
    title: string;
    description: string;
    done: boolean;
    deleted: boolean;
    createdAt: number;
    updatedAt: number;
};

const TOMBSTONE_DAYS = 30;
// A concurrent sync may store its writes just after this one reads; re-sending the
// last few seconds keeps them from being missed (clients merge idempotently).
const OVERLAP_MS = 5000;
// Device clocks drift; a timestamp far in the future would win every conflict.
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

const toClient = (task: TaskDoc) => ({
    id: task.taskId,
    title: task.title,
    description: task.description,
    done: task.done,
    deleted: task.deleted,
    createdAt: task.createdAt.getTime(),
    updatedAt: task.updatedAt.getTime(),
});

// Validates one change from the device; throws a message for the client when it is unusable.
const parseChange = (raw: unknown, now: number): Change => {
    if (!raw || typeof raw !== 'object') throw new Error('A alteração deve ser um objeto.');
    const input = raw as Record<string, unknown>;
    if (!isUuid(input.id)) throw new Error('id inválido: use um UUID.');
    const deleted = input.deleted === true;
    const title = typeof input.title === 'string' ? input.title.trim() : '';
    const description = typeof input.description === 'string' ? input.description.trim() : '';
    if (!deleted && !title) throw new Error('A tarefa precisa de um título.');
    if (title.length > config.titleMax) throw new Error(`O título passa de ${config.titleMax} caracteres.`);
    if (description.length > config.descriptionMax) throw new Error(`A descrição passa de ${config.descriptionMax} caracteres.`);
    const updatedAt = Number(input.updatedAt);
    const createdAt = Number(input.createdAt ?? input.updatedAt);
    if (!Number.isFinite(updatedAt) || !Number.isFinite(createdAt)) throw new Error('createdAt e updatedAt devem ser datas em milissegundos.');
    const latest = now + MAX_CLOCK_SKEW_MS;
    return {
        id: input.id.toLowerCase(),
        title,
        description,
        done: input.done === true,
        deleted,
        createdAt: Math.min(createdAt, latest),
        updatedAt: Math.min(updatedAt, latest),
    };
};

/**
 * POST /v2/sync — body: { since: number | null, changes: Change[] }
 * Stores the device's changes (the newest edit of each task wins) and answers with every
 * task that changed on the server since `since`, plus the changes it could not accept.
 */
export const sync = async (req: Request, res: Response) => {
    const owner = req.owner!;
    const { since = null, changes = [] } = (req.body ?? {}) as { since?: unknown; changes?: unknown };
    if (!Array.isArray(changes)) throw new HttpError(400, 'changes deve ser uma lista.');
    if (changes.length > config.maxTasksPerDevice) throw new HttpError(400, `Envie no máximo ${config.maxTasksPerDevice} alterações por vez.`);
    if (since !== null && !Number.isFinite(Number(since))) throw new HttpError(400, 'since deve ser um número ou null.');

    const now = new Date();
    const rejected: { id: string; reason: string }[] = [];
    const parsed: Change[] = [];
    for (const raw of changes) {
        try {
            parsed.push(parseChange(raw, now.getTime()));
        } catch (error) {
            const id = typeof (raw as { id?: unknown })?.id === 'string' ? (raw as { id: string }).id : '';
            rejected.push({ id, reason: (error as Error).message });
        }
    }

    const existing = new Map(
        (await Task.find({ owner, taskId: { $in: parsed.map(c => c.id) } }).lean()).map(t => [t.taskId, t])
    );
    let liveTasks = await Task.countDocuments({ owner, deleted: false });
    const serverWins: string[] = [];
    const writes: AnyBulkWriteOperation<TaskDoc>[] = [];

    for (const change of parsed) {
        const current = existing.get(change.id);
        if (current && current.updatedAt.getTime() >= change.updatedAt) {
            serverWins.push(change.id); // the device gets the newer server copy back
            continue;
        }
        if (!current && change.deleted) continue; // created and deleted while offline: nothing to keep
        if (!change.deleted && (!current || current.deleted)) {
            if (liveTasks >= config.maxTasksPerDevice) {
                rejected.push({ id: change.id, reason: `Limite de ${config.maxTasksPerDevice} tarefas por aparelho.` });
                continue;
            }
            liveTasks++;
        } else if (change.deleted && current && !current.deleted) {
            liveTasks--;
        }
        writes.push({
            updateOne: {
                filter: { owner, taskId: change.id },
                update: {
                    $set: {
                        title: change.title,
                        description: change.description,
                        done: change.done,
                        deleted: change.deleted,
                        updatedAt: new Date(change.updatedAt),
                        syncedAt: now,
                        ...(change.deleted && { purgeAt: new Date(now.getTime() + TOMBSTONE_DAYS * 864e5) }),
                    },
                    ...(!change.deleted && { $unset: { purgeAt: '' } }),
                    $setOnInsert: { createdAt: new Date(change.createdAt) },
                },
                upsert: true,
            },
        });
    }
    if (writes.length) await Task.bulkWrite(writes, { ordered: false });

    // First sync: only live tasks. Later syncs: everything stored since, tombstones included.
    const query = since === null
        ? { owner, deleted: false }
        : { owner, $or: [{ syncedAt: { $gt: new Date(Number(since) - OVERLAP_MS) } }, { taskId: { $in: serverWins } }] };
    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

    res.json({ serverTime: now.getTime(), tasks: tasks.map(toClient), rejected });
};
