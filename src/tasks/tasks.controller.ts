import { Task } from './tasks.entity';
import { AppDataSource } from '../..';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  //method to get route
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    // declare a vaiable to hold tasks
    let allTasks: Task[];

    try {
      // fetch all tasks on repo
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      // converts tasks instance to array of objects
      allTasks = instanceToPlain(allTasks) as Task[];

      return res.json(allTasks).status(200);
    } catch (_errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }

  // method for post route
  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    // create instance of a Task
    const newTask = new Task();

    // Add the required prooerties to the Task object
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // Add the new Task to the database
    let createdTask: Task;

    try {
      createdTask =
        await AppDataSource.getRepository(Task).save(
          newTask,
        );

      // conver the task instance to plain Object
      createdTask = instanceToPlain(createdTask) as Task;

      return res.json(createdTask).status(201);
    } catch (errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }

  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    // try to find if task exists
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id: req.body.id },
      });
    } catch (_errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }

    //return 400 if task is null

    if (!task) {
      return res
        .json({
          error: 'The task with given ID does not exist',
        })
        .status(404);
    }

    //declare raiable for updatedTask
    let updatedTask: UpdateResult;

    // update the task
    try {
      updatedTask = await AppDataSource.getRepository(
        Task,
      ).update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
        }),
      );

      updatedTask = instanceToPlain(
        updatedTask,
      ) as UpdateResult;

      return res.json(updatedTask).status(200);
    } catch (_errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }

    //convert the updated task instance to an object
  }
}

export const taskController = new TasksController();
