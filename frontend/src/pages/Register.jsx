import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const { setAuth } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try{
      const res = await API.post("/api/auth/register",{ name, email, password });
      setAuth(res.data.token, res.data.user);
      nav("/");
    }catch(err){
      alert(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420,margin:'40px auto'}}>
        <h2 style={{marginTop:0}}>Register</h2>
        <form onSubmit={submit}>
          <div style={{marginBottom:8}}><input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div style={{marginBottom:8}}><input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div style={{marginBottom:12}}><input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
          <div style={{display:'flex',gap:8}}><button className="btn" type="submit">Register</button></div>
        </form>
      </div>
    </div>
  );
}
