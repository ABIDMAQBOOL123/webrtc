require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authroute");
const streamRoutes = require("./routes/streamroute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/live", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/stream", streamRoutes);


io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("offer", (data) => socket.broadcast.emit("offer", data));
  socket.on("answer", (data) => socket.broadcast.emit("answer", data));
  socket.on("candidate", (data) => socket.broadcast.emit("candidate", data));

  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
