import { Express } from "express";
import expressLoader from "./express";

export default async ({ app }: { app: Express }) => {
  await expressLoader({ app });
  console.info("🚂 Express loaded.");
};
