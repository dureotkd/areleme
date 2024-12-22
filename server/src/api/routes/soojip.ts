import { Router, Request, Response } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/soojip", route);

  console.log("hello");

  route.get("/location", (req: Request, res: Response) => {
    const { type } = req.query;

    console.log(type);

    return res.status(200).json({ message: "Success" });
  });
};
