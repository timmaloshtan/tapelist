import { Router, Request, Response } from "express";
import url from "url";
import { google, youtube_v3 } from "googleapis";
import config from "../../config";

const route = Router();

async function* fetchYouTubeResourceItems<T>(
  resource: any,
  options: any
): AsyncGenerator<T, void, unknown> {
  const response = await resource(options);

  const nextPageToken = response?.data?.nextPageToken;

  const items = response?.data?.items || [];

  for (const item of items) {
    yield item;
  }

  if (nextPageToken) {
    yield* fetchYouTubeResourceItems(resource, {
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

    const youtube = google.youtube("v3");

    const playlistItems = [];

    const playlistItemsGernerator = fetchYouTubeResourceItems<
      youtube_v3.Schema$PlaylistItem
    >(youtube.playlistItems.list.bind(youtube.playlistItems), {
      playlistId,
      part: ["snippet", "contentDetails"],
      key: config.youtube.key,
      maxResults: 50,
    });

    for await (const item of playlistItemsGernerator) {
      playlistItems.push({
        title: item.snippet?.title,
        position: item.snippet?.position,
        videoId: item.contentDetails?.videoId,
      });
    }

    const videoIDs = playlistItems.map((playlistItem) => playlistItem.videoId);

    const videos = [];

    const videosGernerator = fetchYouTubeResourceItems<youtube_v3.Schema$Video>(
      youtube.videos.list.bind(youtube.videos),
      {
        id: videoIDs,
        part: ["contentDetails"],
        key: config.youtube.key,
        maxResults: 50,
      }
    );

    for await (const item of videosGernerator) {
      videos.push({
        duration: item.contentDetails?.duration,
        id: item.id,
      });
    }

    console.log("videos", videos);

    res.status(200).json(playlistItems);
  });
};
