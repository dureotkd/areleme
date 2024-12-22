import express from "express";

import expressLoader from "./express";

export default async ({ app: expressApp }: { app: express.Application }) => {
  await expressLoader({ app: expressApp });
};
