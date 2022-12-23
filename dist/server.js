"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./database/mongo");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
(0, mongo_1.mongoConect)();
const server = (0, express_1.default)();
server.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
server.use(body_parser_1.default.json());
server.use(routes_1.default);
server.use((req, res) => {
    res.status(404).send(`Pagina não encontrada`);
});
server.listen(process.env.PORT);
