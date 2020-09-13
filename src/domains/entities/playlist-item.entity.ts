import Duration from "./duration.entity";

class PlaylistItem {
  constructor(
    private readonly _id: string,
    private readonly _url: string,
    private readonly _title: string,
    private readonly _duration: Duration,
    private readonly _position: number
  ) {}

  get id(): string {
    return this._id;
  }
  get url(): string {
    return this._url;
  }
  get title(): string {
    return this._title;
  }
  get duration(): Duration {
    return this._duration;
  }
  get position(): number {
    return this._position;
  }
}

export default PlaylistItem;
