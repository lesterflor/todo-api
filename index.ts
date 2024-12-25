import express, { Express } from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/tasks.entity';
import { tasksRouter } from './src/tasks/tasks.router';

// instantiate express app
const app: Express = express();

dotenv.config();

//parse request body
app.use(bodyParser.json());

// use CORS install types
app.use(cors());

// create database connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true,
});

// define server port
const port = process.env.PORT;

// connect type orm to mysql db
AppDataSource.initialize()
  .then(() => {
    //start listenning to requests on port
    app.listen(port);
    console.log(
      'Success! Data source has been initialized!',
    );
  })
  .catch((err) => {
    console.log('Error during datasource init ', err);
  });

app.use('/', tasksRouter);
