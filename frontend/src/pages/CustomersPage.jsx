import React from "react";
import Header from "../components/Header";
import CustomerList from "../components/CustomerList";

export default function CustomersPage(){
  return (
    <div className="container">
      <Header />
      <div className="mt-4">
        <CustomerList />
      </div>
    </div>
  );
}
