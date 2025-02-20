import { useState, useContext } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
// import AuthContext from "../context/AuthContext";
import AuthContext from "../Context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <Container>
      <Typography variant="h4">Admin Login</Typography>
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
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
