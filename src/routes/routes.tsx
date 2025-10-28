import Dashboard from "@/pages/Dashboard";
import Governance from "@/pages/Governance";
import Home from "@/pages/Home";
import Market from "@/pages/Market";
import Savings from "@/pages/Savings";
import { Navigate, Route } from "react-router-dom";

export const routes = (
  <Route path="/">
    <Route index element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/market" element={<Market />} />
    <Route path="/governance" element={<Governance />} />
    <Route path="/savings" element={<Savings />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
);
