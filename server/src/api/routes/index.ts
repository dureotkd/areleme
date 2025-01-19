import { Router } from 'express';

import collect from './collect';
import address from './address';
import auth from './auth';
import user from './user';
import alarm from './alarm';
import setting from './setting';

export default () => {
  const app = Router();
  collect(app);
  address(app);
  auth(app);
  user(app);
  setting(app);
  alarm(app);

  return app;
};
