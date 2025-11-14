import AssetDetails from "@/pages/asset/AssetDetails";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/landing/LandingPage";
import TransactionHistory from "@/pages/TransactionHistory";
import { Navigate, Route } from "react-router-dom";

export const routes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="history" element={<TransactionHistory />} />
    <Route path="asset-details" element={<AssetDetails />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
