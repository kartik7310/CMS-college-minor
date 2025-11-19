import React from "react";

export default function ExportButton({ params = {} }){
  const onExport = () => {
    // build url with params
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/customers/export${query?`?${query}`:""}`;
    // trigger download by changing location — token attached via axios in backend, but export requires token.
    // Instead we fetch with token and force download:
    const token = localStorage.getItem("token");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "customers.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert("Export failed"));
  };

  return <button className="btn ghost" onClick={onExport}>Export CSV</button>;
}
