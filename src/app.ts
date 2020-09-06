import express, { Express } from "express";

import config from "./config";
import loaders from "./loaders";

export const startServer = async () => {
  const app: Express = express();

  await loaders({ app });

  app.listen(config.port, () => {
    console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  });
};
