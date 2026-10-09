import { Schema, model } from 'mongoose';

export type TaskDoc = {
    owner: string;       // SHA-256 of the device ID: the raw ID never reaches the database
    taskId: string;      // UUID generated on the device, so tasks can be created offline
    title: string;
    description: string;
    done: boolean;
    deleted: boolean;    // tombstone, so a deletion also reaches the other devices
    createdAt: Date;     // when the task was created on the device
    updatedAt: Date;     // last edit on the device: the newest edit wins
    syncedAt: Date;      // when the server stored this version; drives "changes since"
    purgeAt?: Date;      // MongoDB removes tombstones after this date
};

const schema = new Schema<TaskDoc>({
    owner: { type: String, required: true },
    taskId: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    done: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    syncedAt: { type: Date, required: true },
    purgeAt: { type: Date },
}, { versionKey: false });

schema.index({ owner: 1, taskId: 1 }, { unique: true });
schema.index({ owner: 1, syncedAt: 1 });
schema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

// Its own collection: the legacy "tasks" collection stays untouched.
export const Task = model<TaskDoc>('Task', schema, 'devtasks');
