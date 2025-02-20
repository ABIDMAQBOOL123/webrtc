const { Server } = require("socket.io");

exports.setupSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("offer", (data) => {
            socket.broadcast.emit("offer", data);
        });

        socket.on("answer", (data) => {
            socket.broadcast.emit("answer", data);
        });

        socket.on("candidate", (data) => {
            socket.broadcast.emit("candidate", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
