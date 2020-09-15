import Duration from "../duration.entity";
import PlaylistItem from "../playlist-item.entity";
import Playlist from "../playlist.entity";

const URL = "www.random.url";
const TITLE = "Testing playlist";

describe("Playlist entity", () => {
  let playlist: Playlist;

  beforeAll(() => {
    playlist = new Playlist(URL, TITLE, 10);
  });

  it("is a function", () => {
    expect(typeof Playlist).toBe("function");
  });

  describe("without items", () => {
    it("should have a duration of zero", () => {
      expect(playlist.duration.seconds).toEqual(0);
    });

    it("should produce a JSON with empty items", () => {
      expect(playlist.JSON).toEqual(
        JSON.stringify({
          url: URL,
          title: TITLE,
          itemCount: 10,
          duration: "0:00",
          items: [],
        })
      );
    });
  });

  describe("with items", () => {
    beforeAll(() => {
      const items = [
        new PlaylistItem("1", URL + "/1", "First video", new Duration(75), 0),
        new PlaylistItem(
          "2",
          URL + "/2",
          "Second video",
          new Duration(3625),
          1
        ),
        new PlaylistItem("3", URL + "/3", "Third video", new Duration(300), 2),
      ];

      playlist.setItems(items);
    });

    it("should have a duration of sum of its parts", () => {
      expect(playlist.duration.seconds).toEqual(75 + 3625 + 300);
    });

    it("should produce a proper JSON", () => {
      expect(playlist.JSON).toEqual(
        JSON.stringify({
          url: URL,
          title: TITLE,
          itemCount: 10,
          duration: new Duration(75 + 3625 + 300).clock,
          items: [
            {
              url: "www.random.url/1",
              title: "First video",
              position: 0,
              duration: "1:15",
            },
            {
              url: "www.random.url/2",
              title: "Second video",
              position: 1,
              duration: "1:00:25",
            },
            {
              url: "www.random.url/3",
              title: "Third video",
              position: 2,
              duration: "5:00",
            },
          ],
        })
      );
    });
  });
});
