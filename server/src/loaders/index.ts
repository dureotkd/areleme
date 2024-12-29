import 'reflect-metadata';
import express from 'express';

import expressLoader from './express';
import cronLoader from '../jobs/cron';

export default async ({ app: expressApp }: { app: express.Application }) => {
  await expressLoader({ app: expressApp });

  await cronLoader();
};
