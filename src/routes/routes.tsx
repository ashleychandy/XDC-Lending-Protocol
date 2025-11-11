import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/landing/LandingPage";
import { Navigate, Route } from "react-router-dom";

export const routes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
