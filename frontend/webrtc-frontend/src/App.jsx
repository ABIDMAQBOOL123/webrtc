import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [isHost, setIsHost] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    socket.on("stream-started", (broadcasterId) => {
      setStreamStarted(true);
    });

    socket.on("viewer-joined", async (broadcasterId) => {
      console.log("Viewer joined, requesting stream from:", broadcasterId);
      await setupViewer(broadcasterId);
    });

    socket.on("offer", async ({ from, description }) => {
      console.log("Received offer from broadcaster:", from);
      await handleOffer(from, description);
    });

    socket.on("answer", async ({ from, description }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(description)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    socket.on("request-offer", ({ from }) => {
      // Host handles request-offer in setupHost
    });

    return () => {
      socket.off("stream-started");
      socket.off("viewer-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("request-offer");
    };
  }, []);

  const setupHost = async () => {
    setIsHost(true);
    setStreamStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    socket.emit("start-stream");

    peerConnection.current = new RTCPeerConnection();
    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: "viewer",
          candidate: event.candidate,
        });
      }
    };

    socket.on("request-offer", async ({ from }) => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { to: from, description: offer });
    });
  };

  const setupViewer = async (broadcasterId) => {
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: broadcasterId,
          candidate: event.candidate,
        });
      }
    };

    // Request offer from host
    socket.emit("request-offer", { to: broadcasterId });
  };

  const handleOffer = async (from, description) => {
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(description)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { to: from, description: answer });
  };

  const handleJoinStream = () => {
    socket.emit("join-stream");
  };

  return (
    <div className="App">
      <h1>Live Streaming</h1>

      {!streamStarted ? (
        <>
          <button onClick={setupHost}>Start Live Stream (Host)</button>
          <button onClick={handleJoinStream}>Join Live Stream (Viewer)</button>
        </>
      ) : (
        <>
          {isHost ? <h2>Streaming Live...</h2> : <h2>Watching Live...</h2>}
          <video ref={localVideoRef} autoPlay muted={isHost}></video>
          {!isHost && <video ref={remoteVideoRef} autoPlay></video>}
        </>
      )}
    </div>
  );
}

export default App;
