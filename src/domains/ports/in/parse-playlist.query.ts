import { PlaylistUrl } from "../../entities/playlist.entity";

export interface ParsePlaylistQuery {
  parsePlaylist(playlistUrl: PlaylistUrl): Promise<string>;
}
