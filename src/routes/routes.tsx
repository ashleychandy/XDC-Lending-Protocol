import AssetDetails from "@/pages/asset/AssetDetails";
import Dashboard from "@/pages/Dashboard";
import Documentation from "@/pages/Documentation";
import LandingPage from "@/pages/landing/LandingPage";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import TransactionHistory from "@/pages/TransactionHistory";
import { Navigate, Route } from "react-router-dom";

export const routes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="history" element={<TransactionHistory />} />
    <Route path="asset-details" element={<AssetDetails />} />
    <Route path="terms" element={<Terms />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="documentation" element={<Documentation />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
