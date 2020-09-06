import { Router, Request, Response } from "express";
import url from "url";
import { google } from "googleapis";
import config from "../../config";

const route = Router();

export default (app: Router) => {
  app.use("/playlists", route);

  route.post("/parse", async (req: Request, res: Response) => {
    const urlObject = new url.URL(req.body.url as string);
    const playlistId = urlObject.searchParams.get("list") as string;

    const youtube = google.youtube("v3");

    const result = await youtube.playlistItems.list({
      playlistId,
      part: ["snippet", "contentDetails"],
      key: config.youtube.key,
      maxResults: 50,
    });

    res.status(200).json(result);
  });
};
