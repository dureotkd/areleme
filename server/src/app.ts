import express from "express";
import loaders from "./loaders";

(async () => {
  const app = express();

  await loaders({ app });

  app
    .listen(4000, () => {
      console.log("Your Server is Ready !!");
    })
    .on("error", (err) => {
      console.log(err);
    });
})();
