import { app } from './app';
import { config } from './config';
import { connectMongo } from './database/mongo';

app.listen(config.port, () => console.log(`API ouvindo na porta ${config.port}`));

// Mongoose queues queries until the connection is up; without a database the
// process exits so the host restarts it.
connectMongo().catch(error => {
    console.error('Não foi possível conectar ao MongoDB:', error.message);
    process.exit(1);
});
