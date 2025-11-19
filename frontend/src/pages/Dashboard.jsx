import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const [stats, setStats] = useState({ total:0, leads:0 });

  useEffect(() => {
    async function load(){
      try {
        const res = await API.get("/api/customers", { params:{ limit:10000 }});
        const all = res.data.data || [];
        setStats({
          total: all.length,
          leads: all.filter(c => c.status === "lead").length
        });
      } catch (e) { /* ignore */ }
    }
    load();
  },[]);

  return (
    <div className="container">
      <Header/>
      <div style={{marginTop:16}}>
        <div className="card">
          <h2 style={{marginTop:0}}>Dashboard</h2>
          <div style={{display:'flex',gap:24}}>
            <div style={{flex:1}}>
              <div className="small">Total customers</div>
              <div style={{fontSize:24,fontWeight:700}}>{stats.total}</div>
            </div>
            <div style={{flex:1}}>
              <div className="small">Leads</div>
              <div style={{fontSize:24,fontWeight:700}}>{stats.leads}</div>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <Link to="/customers" className="link">Go to Customers →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
