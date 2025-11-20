import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import CustomerForm from "./CustomerForm";
import ExportButton from "./ExportButton";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function CustomerList(){
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const load = async (p=1) => {
    setLoading(true);
    try{
      const res = await API.get("/api/customers", { params: { page:p, limit, search:q, status }});
      setCustomers(res.data.data || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    }catch(err){ alert("Load failed"); }
    setLoading(false);
  };

  useEffect(()=>{ load(1); }, [q, status]);

  const remove = async id => {
    if (!confirm("Delete this customer?")) return;
    try{
      await API.delete(`/api/customers/${id}`);
      load(1);
    }catch(err){
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <input className="input" placeholder="Search name / email / phone" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input w-44" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="lead">Lead</option>
            <option value="active">Customer</option>
          </select>
          <button className="btn" onClick={()=>load(1)}>Search</button>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton params={{ search:q, status }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <CustomerForm editing={editing} onSaved={() => { setEditing(null); load(1); }} onCancel={() => setEditing(null)} />
        </div>

        <div className="col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-slate-500">
                <tr><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Phone</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="5" className="py-4 small">Loading...</td></tr>) :
                customers.length === 0 ? (<tr><td colSpan="5" className="py-4 small">No customers</td></tr>) :
                customers.map(c => (
                  <tr key={c._id} className="border-t">
                    <td className="py-2">
  <Link to={`/customers/${c._id}`} className="text-indigo-600 hover:underline">
    {c.firstName} {c.lastName}
  </Link>
</td>
                    <td className="py-2 small">{c.email}</td>
                    <td className="py-2 small">{c.phone}</td>
                    <td className="py-2 small">{c.status}</td>
                    <td className="py-2">
                      <button className="btn-ghost mr-2" onClick={()=>setEditing(c)}>Edit</button>
                      {user?.role === "admin" && <button className="btn" onClick={()=>remove(c._id)}>Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="small">Showing {customers.length} of {total}</div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost" onClick={() => { if(page>1) load(page-1); }}>Prev</button>
              <div className="small">Page {page}</div>
              <button className="btn-ghost" onClick={() => { if(page*limit < total) load(page+1); }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
