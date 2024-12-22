import { Router, Request, Response } from "express";
import Container from "typedi";

import CollectServiceInstance from "../../services/collect";

const route = Router();

export default (app: Router) => {
  app.use("/collect", route);

  route.get("/local", (req: Request, res: Response) => {
    const { type = "" } = req.query;

    const collectService = Container.get(CollectServiceInstance);

    return res.status(200).json({ message: "Success" });
  });
};
