// src/pages/CustomerDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

export default function CustomerDetails() {
 
  
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
      // When accessing someone else's customer → backend returns 403
      if (err?.response?.status === 403) {
        alert("You do not have permission to view this customer.");
        return nav("/customers");
      }
      alert(err?.response?.data?.error || "Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await API.delete(`/api/customers/${id}`);   // <-- DELETE API HERE
      alert("Customer deleted successfully");
      nav("/customers");
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="card mt-4">Loading customer...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container">
        <Header />
        <div className="card mt-4">Customer not found.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />

      <div className="card mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              {customer.firstName} {customer.lastName}
            </h2>
            <div className="small text-slate-500">{customer.email || "-"}</div>
            <div className="small text-slate-500">{customer.phone || "-"}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/customers" className="btn-ghost">Back</Link>

            <button
              className="btn-ghost"
              onClick={() => nav("/customers", { state: { edit: customer } })}
            >
              Edit
            </button>

            {user?.role === "admin" && (
              <button className="btn" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="small">Status</div>
            <div className="font-medium">{customer.status}</div>
          </div>

          <div>
            <div className="small">Address</div>
            <div>{customer.address || "-"}</div>
          </div>

          <div>
            <div className="small">Tags</div>
            <div>{(customer.tags || []).join(", ") || "-"}</div>
          </div>

          <div>
            <div className="small">Created</div>
            <div className="small">
              {new Date(customer.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
