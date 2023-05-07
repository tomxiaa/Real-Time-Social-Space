// the express package will run our server
const express = require("express"); // express is the package we use to import
const app = express();
app.use(express.static("public")); // this line tells the express app to 'serve' the public folder to clients

// HTTP will expose our server to the web
const http = require("http").createServer(app);

// start our server listening on port 8080 for now (this is standard for HTTP connections)
const server = app.listen(8080); //8080 is psort testing
console.log("Server is running on http://localhost:8080");

/////SOCKET.IO///////
const io = require("socket.io")().listen(server); //importing the whole socket.io engine

const peers = {};

io.on("connection", (socket) => {
  console.log(
    "Someone joined our server using socket.io.  Their socket id is",
    socket.id
  ); // create a event listener for connection as one socket event

  peers[socket.id] = {};

  console.log("Current peers:", peers);

  socket.on("msg", (data) => {
    console.log("Got message from client with id ", socket.id, ":", data);
    let messageWithId = { from: socket.id, data: data };
    socket.broadcast.emit("msg", messageWithId);
  });

  socket.on("disconnect", () => {
    console.log("Someone with ID", socket.id, "left the server");
    delete peers[socket.id];
  }); // create another event for someone left the server
});
