import server from "./server";

const port = parseInt(process.env.PORT || "1717");

server.start(port);
