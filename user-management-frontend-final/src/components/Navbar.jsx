import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar(){
  const loc = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaUserCircle size={28} className="me-2 text-primary" />
          <span>User Management</span>
        </Link>

        <div className="d-flex">
          <Link className={"nav-link " + (loc.pathname === "/create" ? "active" : "")} to="/create">Create User</Link>
          <Link className={"nav-link " + (loc.pathname === "/manage" ? "active" : "")} to="/manage">Manage Users</Link>
        </div>
      </div>
    </nav>
  )
}
