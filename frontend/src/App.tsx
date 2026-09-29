import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import LiveSensors from "./pages/LiveSensors";
import Consumption from "./pages/Consumption";
import AIForecast from "./pages/AIForecast";
import Anomalies from "./pages/Anomalies";
import Reorder from "./pages/Reorder";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

import { NAVIGATION_ITEMS } from "./utils/constants";

const Layout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPage =
    NAVIGATION_ITEMS.find(
      (item) =>
        item.path === location.pathname ||
        (item.path !== "/" &&
          location.pathname.startsWith(item.path))
    )?.label || "Dashboard";

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-h-screen lg:ml-64">
        <Navbar title={currentPage} onMenuClick={() => setMenuOpen(true)} />

        <main key={location.pathname} className="page-enter mx-auto max-w-[1400px] p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sensors" element={<LiveSensors />} />
            <Route path="/consumption" element={<Consumption />} />
            <Route path="/forecast" element={<AIForecast />} />
            <Route path="/anomalies" element={<Anomalies />} />
            <Route path="/reorder" element={<Reorder />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;