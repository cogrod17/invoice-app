import { db } from "./database/config";
import { Server } from "./server";

const port = parseInt(process.env.PORT || "1717");

new Server(db).start(port);
