import { Router, Request, Response } from "express";
import Container from "typedi";

import CollectServiceInstance from "../../services/collect";

const route = Router();

export default (app: Router) => {
  app.use("/collect", route);

  route.get("/local", async (req: Request, res: Response) => {
    const { type = "" } = req.query;

    const collectService = Container.get(CollectServiceInstance);
    await collectService.local();

    return res.status(200).json({ message: "Success" });
  });

  route.get("/region", async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.region();

    return res.status(200).json({ message: "Success" });
  });

  route.get("/dong", async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.dong();

    return res.status(200).json({ message: "Success" });
  });
};
