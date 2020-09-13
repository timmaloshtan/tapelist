class Duration {
  constructor(private readonly _seconds: number) {}

  static SECONDS_PER_DAY = 86400;
  static SECONDS_PER_HOUR = 3600;

  static iso8601DurationRegex = /P(?:(?:[.,\d]+)[YMW])*(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  static iso8601ToSeconds(iso8601Duration: string): number {
    const matches = iso8601Duration.match(Duration.iso8601DurationRegex);

    if (!matches) {
      return 0;
    }

    const days = parseFloat(matches[1]) || 0;
    const hours = parseFloat(matches[2]) || 0;
    const minutes = parseFloat(matches[3]) || 0;
    const seconds = parseFloat(matches[4]) || 0;

    return Math.floor(
      days * Duration.SECONDS_PER_DAY +
        hours * Duration.SECONDS_PER_HOUR +
        minutes * 60 +
        seconds
    );
  }

  public get seconds(): number {
    return this._seconds;
  }

  public get clock(): string {
    const days = Math.floor(this._seconds / Duration.SECONDS_PER_DAY);

    const hours = Math.floor(
      (this._seconds % Duration.SECONDS_PER_DAY) / Duration.SECONDS_PER_HOUR
    );

    const minutes = Math.floor(
      (this._seconds % Duration.SECONDS_PER_HOUR) / 60
    );

    const seconds = this._seconds % 60;

    const daysString = days ? `${days}d:` : "";

    const hoursString = daysString
      ? `${hours.toString().padStart(2, "0")}:`
      : hours
      ? `${hours}:`
      : "";

    const minutesString = hoursString
      ? `${minutes.toString().padStart(2, "0")}:`
      : `${minutes}:`;

    const secondsString = seconds.toString().padStart(2, "0");

    return `${daysString}${hoursString}${minutesString}${secondsString}`;
  }
}

export default Duration;
