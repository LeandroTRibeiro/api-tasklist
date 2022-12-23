import express, { Request, Response } from "express";
import path from "path";
import router from "./routes/routes";
import dotenv from 'dotenv';
import { mongoConect } from "./database/mongo";
import cors from 'cors';
import bodyParser from "body-parser";

dotenv.config();

mongoConect();

const server = express();

server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

server.use(express.static(path.join(__dirname, '../public')));

server.use(bodyParser.json());

server.use(router);

server.use((req: Request, res: Response) => {
    res.status(404).send(`Pagina não encontrada`);
});

server.listen(process.env.PORT);
