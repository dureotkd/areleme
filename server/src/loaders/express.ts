import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { OpticMiddleware } from '@useoptic/express-middleware';

import config from '../config';

import routes from '../api/routes';

export default async ({ app }: { app: express.Application }) => {
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? 'https://www.areleme.com' : '*',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');
  app.use(helmet());

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());

  app.use(
    OpticMiddleware({
      enabled: process.env.NODE_ENV !== 'production', // 개발 환경에서만 활성화
    }),
  );

  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req: Request, res: Response, next) => {
    const err: any = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  return app;
};
