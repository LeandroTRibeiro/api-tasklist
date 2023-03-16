import { Request, Response } from "express";
import Task from '../models/Task';

export const ping = async (req: Request, res: Response) => {
    res.json({pong: true});
};

export const all = async (req: Request, res: Response) => {

    const tasks = await Task.find({});
    
    res.json({ tasks });
};

export const add = async (req: Request, res: Response) => {

    const title = req.body.title as string;
    const description = req.body.description as string;
    const done = false;
    const newTask = new Task;

    if(req.body.title || req.body.description) {
        
        newTask.done = done;

        if(title) {
            newTask.title = title;
        }

        if(description) {
            newTask.description = description;
        }

        await newTask.save();
        res.status(201);
        res.json({ newTask })

    } else {
        res.json({error: 'É necessario adicionar um título ou descrição'});
    }
};

export const att = async (req: Request, res: Response) => {

    const task = await Task.findOne({_id: req.params.id});

    if(task) {

        if(req.body.title) {
            
            task.title = req.body.title;
            task.done = req.body.done;

            if(req.body.description) {
                task.description = req.body.description;
            }
            
            await task.save();
            res.json({task});
        }
    } else {
        res.json({error: 'tarefa não encontrada'});
    }
};

export const del = async (req: Request, res: Response) => {

    const task = await Task.findOne({_id: req.params.id});
    await task?.remove();
    res.json({});
}

export const search = async (req: Request, res: Response) => {

    let regex = new RegExp(req.params.query,'i');

    const task = await Task.find({$or: [{ title: regex}]});
    const allTasks = await Task.find({});

    if(task.length > 0) {
        res.json({task});
    } else {
        res.json({error: 'Nenhum resultado encontrado'});
    }

};

export const getOneTask = async (req: Request, res: Response) => {
    
    const task = await Task.findOne({_id: req.params.id});

        res.json({task});

};
