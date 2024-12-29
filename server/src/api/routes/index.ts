import { Router } from 'express';

import collect from './collect';
import address from './address';
import auth from './auth';
import user from './user';
import alarm from './alarm';

export default () => {
  const app = Router();
  collect(app);
  address(app);
  auth(app);
  user(app);
  alarm(app);

  return app;
};
