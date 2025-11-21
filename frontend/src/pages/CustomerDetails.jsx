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
  const [deleting, setDeleting] = useState(false);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Determine ownership: check common fields that backends use to store creator/owner
  const isOwner = (() => {
    if (!user || !customer) return false;
    const userId = String(user._id ?? user.id ?? user.uid ?? "");
    const possibleOwnerFields = [
      customer.createdBy,
      customer.createdById,
      customer.owner,
      customer.userId,
      customer.ownerId,
      customer.creator,
    ];
    return possibleOwnerFields.some((f) => String(f ?? "") === userId);
  })();

  const canDelete = user?.role === "admin" || isOwner;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    setDeleting(true);
    try {
      await API.delete(`/api/customers/${id}`);
      alert("Customer deleted successfully");
      nav("/customers");
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    } finally {
      setDeleting(false);
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
            <Link to="/customers" className="btn-ghost">
              Back
            </Link>

            <button
              className="btn-ghost"
              onClick={() => nav("/customers", { state: { edit: customer } })}
            >
              Edit
            </button>

            {canDelete && (
              <button className="btn" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
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
              {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
