import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const LiveStream = () => {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        socket.emit("start-stream", stream);
      });

    socket.on("stream-started", (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
  );
};

export default LiveStream;
