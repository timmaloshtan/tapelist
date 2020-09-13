import PlaylistItem from "../../entities/playlist-item.entity";
import { PlaylistUrl } from "../../entities/playlist.entity";

export interface LoadPlaylistItemsPort {
  loadPlaylistItems(playlistUrl: PlaylistUrl): Promise<PlaylistItem[]>;
}
