const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const port = 8080;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    socket.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", (socket) => {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, () => {
  console.log("App is running on port " + port);
});
