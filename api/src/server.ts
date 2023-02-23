import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import db from "./database";
import routes from "./routes";
import { swaggerDocument } from "./docs/swagger";
import { DB } from "./database/config";

export class Server {
  public app: Application;
  public db: DB;

  constructor(database: DB) {
    this.app = express();
    this.db = database;
    this.config();
    this.routerConfig();
    this.dbConnect();
    this.docs();
  }

  private docs = () =>
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  private config = () => {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  };

  private dbConnect = () => db.connect();

  private routerConfig = () => {
    for (let i = 0; i < routes.length; i++) {
      this.app.use(routes[i]);
    }
  };

  public start = (port: number): Promise<object | number> =>
    new Promise((resolve, reject) =>
      this.app
        .listen(port, () => {
          resolve(port);
          console.log("listening on port " + port);
        })
        .on("error", (err: object) => reject(err))
    );
}
