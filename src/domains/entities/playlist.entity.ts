import Duration from "./duration.entity";
import PlaylistItem from "./playlist-item.entity";

export type PlaylistUrl = string;

class Playlist {
  constructor(
    private readonly _url: PlaylistUrl,
    private readonly _title: string,
    private _items: PlaylistItem[] = []
  ) {}

  get url(): string {
    return this._url;
  }

  get title(): string {
    return this._title;
  }

  get itemCount(): number {
    return this._items.length;
  }

  get duration(): Duration {
    return new Duration(
      this._items.reduce((acc, item) => acc + item.duration.seconds, 0)
    );
  }

  setItems(items: PlaylistItem[]): void {
    this._items = items;
  }

  get JSON() {
    const data = {
      url: this._url,
      title: this._title,
      itemCount: this.itemCount,
      duration: this.duration.clock,
      items: this._items.map((item) => ({
        url: item.url,
        title: item.title,
        position: item.position,
        duration: item.duration.clock,
      })),
    };

    return JSON.stringify(data);
  }
}

export default Playlist;
