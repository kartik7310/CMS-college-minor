import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import CustomerForm from "./CustomerForm";
import ExportButton from "./ExportButton";
import { AuthContext } from "../context/AuthContext";

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

  const load = async (p=page) => {
    setLoading(true);
    try{
      const res = await API.get("/api/customers", { params: { page:p, limit, search:q, status }});
      setCustomers(res.data.data || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    }catch(err){ alert("Failed to load"); }
    setLoading(false);
  };

  useEffect(()=>{ load(1); }, [q, status]);

  const onDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    try{
      await API.delete(`/api/customers/${id}`);
      load(1);
    }catch(err){
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  const onSave = ()=>{ setEditing(null); load(1); };

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input className="input" placeholder="Search name / email / phone" value={q} onChange={e=>setQ(e.target.value)} style={{width:300}} />
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)} style={{width:140}}>
            <option value="">All</option>
            <option value="lead">Lead</option>
            <option value="active">Customer</option>
          </select>
          <button className="btn" onClick={()=>load(1)}>Search</button>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <ExportButton params={{ search:q, status }} />
        </div>
      </div>

      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1}}>
          <CustomerForm editing={editing} onSaved={onSave} onCancel={()=>setEditing(null)} />
        </div>

        <div style={{flex:2}}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5">Loading...</td></tr> :
                customers.length === 0 ? <tr><td colSpan="5">No customers</td></tr> :
                customers.map(c => (
                  <tr key={c._id}>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td className="small">{c.status}</td>
                    <td>
                      <button className="btn ghost" onClick={()=>setEditing(c)}>Edit</button>
                      {/* only show delete to admin */}
                      {user?.role === "admin" && <button className="btn" onClick={()=>onDelete(c._id)} style={{marginLeft:8}}>Delete</button>}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
            <div className="small">Showing {customers.length} of {total}</div>
            <div className="pagination">
              <button className="btn ghost" onClick={()=>{ if(page>1){ setPage(p=>p-1); load(page-1); }}}>Prev</button>
              <div className="small">Page {page}</div>
              <button className="btn ghost" onClick={()=>{ if(page*limit < total){ setPage(p=>p+1); load(page+1); }}}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
