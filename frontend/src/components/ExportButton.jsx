import React from "react";

export default function ExportButton({ params = {} }){
  const onExport = async () => {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/customers/export${query?`?${query}`:""}`;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "customers.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Export failed");
    }
  };

  return <button className="btn-ghost" onClick={onExport}>Export CSV</button>;
}
