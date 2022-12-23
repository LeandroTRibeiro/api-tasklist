import { Schema, model, connection, Model } from "mongoose";

type TaskType = {
    title: string,
    description: string,
    done: boolean
};

const schema = new Schema<TaskType>({
    title: {type: String, required: true},
    description: {type: String},
    done: {type: Boolean}
});

const modelName = 'Task';

const taskModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<TaskType>)
    : model<TaskType>(modelName, schema);

export default taskModel;