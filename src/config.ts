import dotenv from 'dotenv';

dotenv.config();

const required = (name: string) => {
    const value = process.env[name];
    if (!value) throw new Error(`Variável de ambiente ${name} não definida.`);
    return value;
};

export const config = {
    port: Number(process.env.PORT) || 2000,
    mongoUrl: required('MONGO_URL'),
    // Front-end origins allowed to call /v2, comma separated (e.g. the published app's URL).
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean),
    // The Atlas cluster is shared and close to its storage limit: keep each device small.
    maxTasksPerDevice: 500,
    titleMax: 120,
    descriptionMax: 500,
};
