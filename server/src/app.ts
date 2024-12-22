import express from "express";

import loaders from "./loaders";
import config from "./config";

(async () => {
  const app = express();

  await loaders({ app });

  app
    .listen(config.port, () => {
      console.log("Your Server is Ready !!");
    })
    .on("error", (err) => {
      console.log(err);
    });
})();
