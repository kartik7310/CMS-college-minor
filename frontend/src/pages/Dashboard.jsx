import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const [counts, setCounts] = useState({ total:0, leads:0 });

  useEffect(() => {
    async function load(){
      try {
        const res = await API.get("/api/customers", { params: { limit: 10000 }});
        const all = res.data.data || [];
        setCounts({
          total: all.length,
          leads: all.filter(c => c.status === "lead").length
        });
      } catch (e) { /* ignore */ }
    }
    load();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="card mt-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded">
            <div className="small">Total customers</div>
            <div className="text-2xl font-bold">{counts.total}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <div className="small">Leads</div>
            <div className="text-2xl font-bold">{counts.leads}</div>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/customers" className="text-indigo-600 hover:underline">Manage customers →</Link>
        </div>
      </div>
    </div>
  );
}
