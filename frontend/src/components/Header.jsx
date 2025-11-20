import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <div className="card flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">CIS</div>
        <Link to="/" className="text-indigo-600 hover:underline small">Dashboard</Link>
        <Link to="/customers" className="text-indigo-600 hover:underline small">Customers</Link>
      </div>

      <div className="flex items-center gap-3">
        {user && <div className="small">{user.name} • <span className="text-slate-400">{user.role}</span></div>}
        {user ? (
          <button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>Logout</button>
        ) : (
          <Link to="/login" className="btn-ghost">Sign in</Link>
        )}
      </div>
    </div>
  );
}
