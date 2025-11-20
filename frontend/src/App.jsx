import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import { AuthContext } from "./context/AuthContext";
import CustomerDetails from "./pages/CustomerDetails";


function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><CustomersPage/></PrivateRoute>} />
           <Route path="/customers/:id" element={<PrivateRoute><CustomerDetails/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
