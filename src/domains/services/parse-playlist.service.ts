import { PlaylistUrl } from "../entities/playlist.entity";
import { ParsePlaylistQuery } from "../ports/in/parse-playlist.query";
import { LoadPlaylistPort } from "../ports/out/load-playlist.port";
import { LoadPlaylistItemsPort } from "../ports/out/load-playlist-items.port";

class ParsePlaylistService implements ParsePlaylistQuery {
  constructor(
    private readonly _loadPlaylistPort: LoadPlaylistPort,
    private readonly _loadPlaylistItemsPort: LoadPlaylistItemsPort
  ) {}

  async parsePlaylist(playlistUrl: PlaylistUrl) {
    const playlist = await this._loadPlaylistPort.loadPlaylist(playlistUrl);

    const items = await this._loadPlaylistItemsPort.loadPlaylistItems(
      playlistUrl
    );

    playlist.setItems(items);

    return playlist.JSON;
  }
}

export default ParsePlaylistService;
