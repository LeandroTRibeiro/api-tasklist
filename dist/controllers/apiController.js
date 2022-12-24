"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneTask = exports.search = exports.del = exports.att = exports.add = exports.all = exports.ping = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const ping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ pong: true });
});
exports.ping = ping;
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Task_1.default.find({});
    res.json({ tasks });
});
exports.all = all;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const description = req.body.description;
    const done = false;
    const newTask = new Task_1.default;
    if (req.body.title) {
        newTask.title = title;
        newTask.done = done;
        if (description) {
            newTask.description = description;
        }
        yield newTask.save();
        res.status(201);
        res.json({ newTask });
    }
    else {
        res.json({ error: 'erro de requicição' });
    }
});
exports.add = add;
const att = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.default.findOne({ _id: req.params.id });
    if (task) {
        if (req.body.title) {
            task.title = req.body.title;
            task.done = req.body.done;
            if (req.body.description) {
                task.description = req.body.description;
            }
            yield task.save();
            res.json({ task });
        }
    }
    else {
        res.json({ error: 'tarefa não encontrada' });
    }
});
exports.att = att;
const del = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.default.findOne({ _id: req.params.id });
    yield (task === null || task === void 0 ? void 0 : task.remove());
    res.json({});
});
exports.del = del;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let regex = new RegExp(req.params.query, 'i');
    const task = yield Task_1.default.find({ $or: [{ title: regex }] });
    const allTasks = yield Task_1.default.find({});
    if (task.length > 0) {
        res.json({ task });
    }
    else {
        res.json({ error: 'Nenhum resultado encontrado' });
    }
});
exports.search = search;
const getOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.default.findOne({ _id: req.params.id });
    res.json({ task });
});
exports.getOneTask = getOneTask;
