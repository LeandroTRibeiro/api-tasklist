import mongoose from 'mongoose';
import { config } from '../config';

export const connectMongo = async () => {
    await mongoose.connect(config.mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('Conectado ao MongoDB');
};
