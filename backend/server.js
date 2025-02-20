const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let broadcaster = null;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("start-stream", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("stream-started", broadcaster);
    console.log("Host started streaming:", broadcaster);
  });

  socket.on("join-stream", () => {
    console.log("Viewer joined:", socket.id);
    if (broadcaster) {
      socket.emit("viewer-joined", broadcaster);
    }
  });

  socket.on("request-offer", ({ to }) => {
    socket.to(to).emit("request-offer", { from: socket.id });
  });

  socket.on("offer", ({ to, description }) => {
    io.to(to).emit("offer", { from: socket.id, description });
  });

  socket.on("answer", ({ to, description }) => {
    io.to(to).emit("answer", { from: socket.id, description });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.id === broadcaster) {
      broadcaster = null;
      io.emit("stream-ended");
    }
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));