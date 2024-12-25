import { Response, Request, Router } from 'express';
import { taskController } from './tasks.controller';
import {
  createValidator,
  updateValidator,
} from './tasks.validator';

// fire the router function
export const tasksRouter: Router = Router();

// create default route
tasksRouter.get('/tasks', (req: Request, res: Response) => {
  taskController.getAll(req, res);
});

tasksRouter.post(
  '/tasks',
  createValidator,
  (req: Request, res: Response) => {
    taskController.create(req, res);
  },
);

tasksRouter.put(
  '/tasks',
  updateValidator,
  (req: Request, res: Response) => {
    taskController.update(req, res);
  },
);
