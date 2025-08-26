import React, { useEffect, useState } from "react";
import { ManageAPI, NotificationAPI } from "../api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await ManageAPI.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load users (API down?) - showing sample data");
      setUsers([
        { id: 1, name: "Alice", email: "alice@mail.com", mobile: "9991112222", jobRole: "Developer" },
        { id: 2, name: "Bob", email: "bob@mail.com", mobile: "8882223333", jobRole: "Manager" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const remove = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await ManageAPI.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const saveEdit = async () => {
    try {
      // ✅ Update user
      await ManageAPI.put(`/users/${editUser.id}`, editUser);

      // ✅ Send notification (non-blocking)
      try {
        await NotificationAPI.post("/notify", {
          subject: "User Updated",
          message: `User updated:\nName: ${editUser.name}\nEmail: ${editUser.email}\nMobile: ${editUser.mobile}\nJob Role: ${editUser.jobRole}`,
        });
      } catch (notifyErr) {
        console.warn("User updated, but notification failed:", notifyErr);
        alert("User updated ✅ (notification failed ❌)");
      }

      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: "#2b2560" }}>Manage Users</h3>
        <button className="btn btn-outline-secondary" onClick={fetchUsers}>Refresh</button>
      </div>

      <div className="table-responsive card card-custom p-0">
        <table className="table mb-0">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Job Role</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No users</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile || "-"}</td>
                <td>{u.job_role || "-"}</td>
                <td>
                  <select className="form-select form-select-sm" defaultValue="User">
                    <option>User</option>
                    <option>Admin</option>
                    <option>Developer</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditUser({ ...u })}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="edit-panel card p-4 mt-3">
          <h5>Edit User</h5>
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input className="form-control" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input className="form-control" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
          </div>
          <div className="mb-2">
            <label className="form-label">Mobile</label>
            <input className="form-control" value={editUser.mobile} onChange={e => setEditUser({ ...editUser, mobile: e.target.value })} />
          </div>
          <div className="mb-2">
            <label className="form-label">Job Role</label>
            <input className="form-control" value={editUser.jobRole} onChange={e => setEditUser({ ...editUser, jobRole: e.target.value })} />
          </div>
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
            <button className="btn btn-success" onClick={saveEdit}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
