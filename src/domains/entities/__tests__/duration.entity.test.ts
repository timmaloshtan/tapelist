import Duration from "../duration.entity";

const durations = [
  new Duration(Duration.iso8601ToSeconds("")),
  new Duration(Duration.iso8601ToSeconds("P2Y1M4DT1H3M37S")),
  new Duration(Duration.iso8601ToSeconds("P2YT1H3M37S")),
  new Duration(Duration.iso8601ToSeconds("P1DT61M")),
  new Duration(Duration.iso8601ToSeconds("PT24H")),
  new Duration(Duration.iso8601ToSeconds("PT1.5H7M26.6S")),
  new Duration(Duration.iso8601ToSeconds("PT300S")),
  new Duration(Duration.iso8601ToSeconds("P0DT2H30M40S")),
  new Duration(Duration.iso8601ToSeconds("PT1H20S")),
  new Duration(Duration.iso8601ToSeconds("PT19S")),
];

describe("Duration entity", () => {
  it("is a function", () => {
    expect(typeof Duration).toBe("function");
  });

  it("should convert ISO 8601 to seconds", () => {
    const results = durations.map((duration) => duration.seconds);

    const expected = [
      0,
      4 * Duration.SECONDS_PER_DAY + Duration.SECONDS_PER_HOUR + 3 * 60 + 37,
      Duration.SECONDS_PER_HOUR + 3 * 60 + 37,
      1 * Duration.SECONDS_PER_DAY + 61 * 60,
      Duration.SECONDS_PER_DAY,
      1.5 * Duration.SECONDS_PER_HOUR + 7 * 60 + 26,
      300,
      2 * Duration.SECONDS_PER_HOUR + 30 * 60 + 40,
      Duration.SECONDS_PER_HOUR + 20,
      19,
    ];

    expect(results).toEqual(expected);
  });

  it("should render proper clocks", () => {
    const results = durations.map((duration) => duration.clock);

    const expected = [
      "0:00",
      "4d:01:03:37",
      "1:03:37",
      "1d:01:01:00",
      "1d:00:00:00",
      "1:37:26",
      "5:00",
      "2:30:40",
      "1:00:20",
      "0:19",
    ];

    expect(results).toEqual(expected);
  });
});
