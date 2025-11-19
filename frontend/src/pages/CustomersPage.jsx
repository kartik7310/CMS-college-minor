import React from "react";
import Header from "../components/Header";
import CustomerList from "../components/CustomerList";

export default function CustomersPage(){
  return (
    <div className="container">
      <Header/>
      <div style={{marginTop:16}}>
        <CustomerList />
      </div>
    </div>
  );
}
