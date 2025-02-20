import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container } from "@mui/material";
import LiveStream from "./LiveStream";
import VideoPlayer from "./VideoPlayer"; // ✅ Import VideoPlayer.js

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [streaming, setStreaming] = useState(false);

  const createUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/create", {
        username,
        email,
        password,
      });
      alert("User Created Successfully!");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Admin Dashboard</Typography>
      <TextField
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={createUser}>
        Create User
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setStreaming(true)}
      >
        Start Streaming
      </Button>
      {streaming && <LiveStream />}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Live Stream
      </Typography>
      <VideoPlayer /> {/* ✅ Now users can watch the stream */}
    </Container>
  );
};

export default AdminDashboard;
