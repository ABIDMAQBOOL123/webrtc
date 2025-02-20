import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        try {
            await axios.post("http://localhost:5000/api/users/create", { username, email, password });
            alert("User Created!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={createUser}>Create User</button>
        </div>
    );
};

export default AdminDashboard;
