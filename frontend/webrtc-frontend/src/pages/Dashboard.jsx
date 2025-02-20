import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]); // User list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Default role is 'user'
  });
  const [addingUser, setAddingUser] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users
  useEffect(() => {
    axios
      .get("/api/auth/users")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUsers(res.data); // Ensure response is an array before setting state
        } else {
          setError("Invalid response format from server.");
        }
      })
      .catch(() => setError("Failed to fetch users."))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user addition
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token"); // Ensure admin is authenticated
      const res = await axios.post("/api/auth/admin/add-user", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers([...users, res.data.newUser]); // Add new user to UI
      setSuccessMessage("User added successfully!");
      setFormData({ username: "", email: "", password: "", role: "user" }); // Reset form
    } catch (err) {
      setError("Failed to add user.");
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => (window.location.href = "/stream")}>
        Start Live Stream
      </button>

      {/* Add User Form */}
      <h2>Add User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={addingUser}>
          {addingUser ? "Adding..." : "Add User"}
        </button>
      </form>

      {/* User List */}
      <h2>Users</h2>
      {loading && <p>Loading users...</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - {user.email} ({user.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
