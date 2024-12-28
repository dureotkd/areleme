import { Router } from 'express';
import collect from './collect';
import address from './address';
import auth from './auth';

export default () => {
  const app = Router();
  collect(app);
  address(app);
  auth(app);

  return app;
};
