import { Router } from 'express';

import collect from './collect';
import address from './address';
import auth from './auth';
import user from './user';
import alaram from './alaram';

export default () => {
  const app = Router();
  collect(app);
  address(app);
  auth(app);
  user(app);
  alaram(app);

  return app;
};
