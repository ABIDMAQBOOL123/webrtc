import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const LiveStream = () => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.current.srcObject = stream;
        peerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        peerConnection.current.ontrack = (event) => {
          remoteVideo.current.srcObject = event.streams[0];
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("candidate", event.candidate);
          }
        };

        socket.on("offer", async (offer) => {
          await peerConnection.current.setRemoteDescription(offer);
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("answer", answer);
        });

        socket.on("answer", async (answer) => {
          await peerConnection.current.setRemoteDescription(answer);
        });

        socket.on("candidate", async (candidate) => {
          await peerConnection.current.addIceCandidate(candidate);
        });
      });
  }, []);

  return (
    <div>
      <video ref={localVideo} autoPlay playsInline></video>
      <video ref={remoteVideo} autoPlay playsInline></video>
      <button
        onClick={async () => {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", offer);
        }}
      >
        Start Streaming
      </button>
    </div>
  );
};

export default LiveStream;
