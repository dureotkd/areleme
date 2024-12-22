import { Router } from "express";
import collect from "./collect";

export default () => {
  const app = Router();
  collect(app);

  return app;
};
