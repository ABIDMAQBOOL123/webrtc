import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoPlayer = () => {
  const videoRef = useRef();

  useEffect(() => {
    socket.on("stream-started", (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
  );
};

export default VideoPlayer;
