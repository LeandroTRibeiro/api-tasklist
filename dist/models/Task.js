"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: { type: String },
    description: { type: String },
    done: { type: Boolean }
});
const modelName = 'Task';
const taskModel = mongoose_1.connection && mongoose_1.connection.models[modelName]
    ? mongoose_1.connection.models[modelName]
    : (0, mongoose_1.model)(modelName, schema);
exports.default = taskModel;
