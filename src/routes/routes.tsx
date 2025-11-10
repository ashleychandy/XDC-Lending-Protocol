import AssetDetails from "@/pages/asset/AssetDetails";
import Dashboard from "@/pages/Dashboard";
import Governance from "@/pages/Governance";
import LandingPage from "@/pages/landing/LandingPage";
import Market from "@/pages/Market";
import NotFound from "@/pages/NotFound";
import Savings from "@/pages/Savings";
import { Route } from "react-router-dom";

export const routes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="asset-details" element={<AssetDetails />} />
    <Route path="market" element={<Market />} />
    <Route path="governance" element={<Governance />} />
    <Route path="savings" element={<Savings />} />
    <Route path="*" element={<NotFound />} />
  </>
);
