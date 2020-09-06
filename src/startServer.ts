import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import url from "url";

const startServer = async () => {
  const app: Express = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
  });

  app.post("/process", (req: Request, res: Response) => {
    const urlObject = new url.URL(req.body.url as string);
    console.log(urlObject.searchParams.get("list"));
    res.send("done");
  });

  app.listen(8080, () => {
    console.log("Server is running on the port 8080");
  });
};

export default startServer;
