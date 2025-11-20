import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function CustomerForm({ editing = null, onSaved, onCancel }) {
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [status,setStatus] = useState("lead");
  const [saving,setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setFirstName(editing.firstName || "");
      setLastName(editing.lastName || "");
      setEmail(editing.email || "");
      setPhone(editing.phone || "");
      setAddress(editing.address || "");
      setStatus(editing.status || "lead");
    } else {
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress(""); setStatus("lead");
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    if (!firstName) return alert("First name required");
    setSaving(true);
    try {
      const payload = { firstName, lastName, email, phone, address, status };
      if (editing) await API.put(`/api/customers/${editing._id}`, payload);
      else await API.post("/api/customers", payload);
      onSaved && onSaved();
    } catch (err) {
      alert(err?.response?.data?.error || "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium">{editing ? "Edit customer" : "Add customer"}</h3>
      <form className="mt-3 space-y-2" onSubmit={submit}>
        <input className="input" placeholder="First name *" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="input" placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="lead">Lead</option>
          <option value="active">Customer</option>
        </select>

        <div className="flex items-center gap-2">
          <button className="btn" type="submit" disabled={saving}>{saving ? "Saving..." : (editing ? "Update" : "Add")}</button>
          {editing && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
