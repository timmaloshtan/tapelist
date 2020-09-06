import { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "../api";
import config from "../config";

export default async ({ app }: { app: Express }) => {
  /**
   * Health Check endpoints
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  /**
   * CORS settings
   */
  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Load API routes
   */
  app.use(config.api.prefix, routes());
};
