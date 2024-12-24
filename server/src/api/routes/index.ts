import { Router } from 'express';
import collect from './collect';
import address from './address';

export default () => {
  const app = Router();
  collect(app);
  address(app);

  return app;
};
