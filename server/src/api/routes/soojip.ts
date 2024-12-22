import { Router, Request, Response } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/soojip", route);

  route.get("/local", (req: Request, res: Response) => {
    const { type } = req.query;

    return res.status(200).json({ message: "Success" });
  });
};
