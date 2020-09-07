import { Router, Request, Response } from "express";
import url from "url";
import { google, youtube_v3 } from "googleapis";
import config from "../../config";

const route = Router();

async function* fetchYouTubePlaylistItems(
  options: youtube_v3.Params$Resource$Playlistitems$List
): AsyncGenerator<youtube_v3.Schema$PlaylistItem, void, unknown> {
  const youtube = google.youtube("v3");

  const response = await youtube.playlistItems.list(options);

  const nextPageToken = response?.data?.nextPageToken;

  const items = response?.data?.items || [];

  for (const item of items) {
    yield item;
  }

  if (nextPageToken) {
    yield* fetchYouTubePlaylistItems({
      ...options,
      pageToken: nextPageToken,
    });
  }
}

export default (app: Router) => {
  app.use("/playlists", route);

  route.post("/parse", async (req: Request, res: Response) => {
    const urlObject = new url.URL(req.body.url as string);
    const playlistId = urlObject.searchParams.get("list") as string;

    const items = [];

    const generator = fetchYouTubePlaylistItems({
      playlistId,
      part: ["snippet", "contentDetails"],
      key: config.youtube.key,
      maxResults: 50,
    });

    for await (const item of generator) {
      items.push({
        title: item.snippet?.title,
        position: item.snippet?.position,
        videoId: item.contentDetails?.videoId,
      });
    }

    res.status(200).json(items);
  });
};
