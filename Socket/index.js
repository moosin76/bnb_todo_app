require('dotenv').config();

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://todo.bnb.com:5080",
  },
});

global.$IO = io;
require('./chat');

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://sockek.bnb.com:${PORT}`)
);
