import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const onLogout = () => { logout(); nav("/login"); };

  return (
    <div className="header">
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <div style={{fontWeight:700}}>CIS</div>
        <Link to="/" className="small link">Dashboard</Link>
        <Link to="/customers" className="small link">Customers</Link>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {user ? <div className="small">{user.name} ({user.role})</div> : null}
        {user ? <button className="btn ghost" onClick={onLogout}>Logout</button> : null}
      </div>
    </div>
  );
}
