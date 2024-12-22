import express, { Request, Response } from "express";
import cors from "cors";

import routes from "../api/routes";

export default async ({ app }: { app: express.Application }) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.enable("trust proxy");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes());

  return app;
};
