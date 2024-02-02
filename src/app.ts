/* eslint-disable @typescript-eslint/no-explicit-any */
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import { DEFAULT_BASE_METHODS } from './constants';
import Database from './dbs/config.mongodb';
import { errorHandler } from './middleware/errorHandler';
import { Routes } from './routes';
import { NotFoundError } from './core/errorResponse.core';

dotenv.config();
const app: Express = express();

//  connect mongodb
Database.getInstance();


app.use(
  cors({
    origin: '*',
    methods: DEFAULT_BASE_METHODS,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
// gzip compression
app.use(compression());

// set security HTTP headers
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// sanitize request data
app.use(ExpressMongoSanitize());

app.use('/api', Routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError(`Route ${req.originalUrl} not found`).getNotice() as any;
  next(err);
});

app.use(errorHandler);

export default app;
