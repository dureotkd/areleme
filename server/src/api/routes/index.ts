import { Router } from "express";
import soojip from "./soojip";

export default () => {
  const app = Router();
  soojip(app);

  return app;
};
