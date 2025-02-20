import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function LiveStream() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const peer = new RTCPeerConnection();
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        peer.onicecandidate = (e) => {
          if (e.candidate) socket.emit("candidate", e.candidate);
        };

        peer.ontrack = (e) => {
          remoteVideoRef.current.srcObject = e.streams[0];
        };

        socket.on("offer", async (offer) => {
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit("answer", answer);
        });

        socket.on("answer", async (answer) => {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("candidate", async (candidate) => {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        });

        peer.createOffer().then((offer) => {
          peer.setLocalDescription(offer);
          socket.emit("offer", offer);
        });
      });
  }, []);

  return (
    <div>
      <h1>Live Streaming</h1>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
}

export default LiveStream;
