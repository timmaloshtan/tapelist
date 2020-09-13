import Playlist, { PlaylistUrl } from "../../entities/playlist.entity";

export interface LoadPlaylistPort {
  loadPlaylist(playlistUrl: PlaylistUrl): Promise<Playlist>;
}
