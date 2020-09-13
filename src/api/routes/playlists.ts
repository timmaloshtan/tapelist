import { Router, Request, Response } from "express";
import url from "url";
import { google, youtube_v3 } from "googleapis";
import config from "../../config";
import {
  parseISO8601Duration,
  durationToString,
} from "../../utils/parseISO8601Durations";

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

    const playlist = (
      await youtube.playlists.list({
        id: [playlistId],
        part: ["snippet"],
        key: config.youtube.key,
      })
    )?.data?.items?.[0];

    const playlistItems: any[] = [];

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
      const durationObject = parseISO8601Duration(
        item.contentDetails?.duration as string
      );
      const { days, hours, minutes, seconds } = durationObject;

      const duration =
        days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

      const durationString = durationToString(durationObject);
      videos.push({
        durationObject,
        durationString,
        duration,
        id: item.id,
      });
    }

    const playlistDurationInSeconds = videos.reduce(
      (duration, video) => duration + video.duration,
      0
    );

    const responseObject = {
      videos: videos.map((video, index) => ({
        ...video,
        ...playlistItems[index],
      })),
      title: playlist?.snippet?.title,
      duration: playlistDurationInSeconds / 3600,
      playlistId,
    };

    res.status(200).json(responseObject);
  });
};
