import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateUser from "./components/CreateUser";
import ManageUsers from "./components/ManageUsers";

const Home = () => (
  <div className="text-center mt-5">
    <h1 className="display-5">👋 Welcome to User Management Service</h1>
    <p className="lead text-muted">Create and manage users seamlessly.</p>
  </div>
);

export default function App(){
  return (
    <Router>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/manage" element={<ManageUsers />} />
        </Routes>
      </div>
    </Router>
  )
}
