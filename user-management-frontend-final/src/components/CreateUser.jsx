import React, { useState } from "react";
import { CreateAPI, NotificationAPI } from "../api";

export default function CreateUser() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", jobRole: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Call Create Service
      const res = await CreateAPI.post("/users", form);

      // ✅ Call Notification Service (non-blocking)
      try {
        await NotificationAPI.post("/notify", {
          subject: "Welcome to User Management",
          message: `Hi ${form.name}, your account was created successfully!`,
        });
      } catch (notifyErr) {
        console.warn("User created, but notification failed:", notifyErr);
        alert("User created ✅ (notification failed ❌)");
        setForm({ name: "", email: "", mobile: "", jobRole: "" });
        return;
      }

      alert("User created successfully ✅");
      setForm({ name: "", email: "", mobile: "", jobRole: "" });

    } catch (err) {
      console.error("User creation failed:", err);
      alert("❌ Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="app-hero w-100 max-w-2xl card-custom p-4 shadow rounded bg-white">
        <h2 className="mb-3 text-primary">Create User</h2>
        <form onSubmit={submit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input name="name" value={form.name} onChange={change} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={change} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile</label>
            <input name="mobile" value={form.mobile} onChange={change} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Job Role</label>
            <input name="jobRole" value={form.jobRole} onChange={change} className="form-control" required />
          </div>
          <div className="col-12">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
