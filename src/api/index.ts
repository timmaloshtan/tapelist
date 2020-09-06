import { Router } from "express";
import playlists from "./routes/playlists";

// guaranteed to get dependencies
export default () => {
  const router = Router();

  playlists(router);

  return router;
};
