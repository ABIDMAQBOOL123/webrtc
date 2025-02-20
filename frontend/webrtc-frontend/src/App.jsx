import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// import LiveStream from "./pages/LiveStream";
import LiveStream from "./pages/LiveSTream";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/stream">Live Stream</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stream" element={<LiveStream />} />
      </Routes>
    </Router>
  );
}

export default App;
