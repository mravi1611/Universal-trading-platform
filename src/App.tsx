
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Account from "./pages/Account";
import Funds from "./pages/Funds";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import ActivityLogs from "./pages/ActivityLogs";

// Market Pages
import StocksMarket from "./pages/markets/Stocks";
import CryptoMarket from "./pages/markets/Crypto";
import ForexMarket from "./pages/markets/Forex";
import FundsMarket from "./pages/markets/Funds";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/account" element={<Account />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/history" element={<History />} />
              <Route path="/activity" element={<ActivityLogs />} />
              
              {/* Market Routes */}
              <Route path="/markets/stocks" element={<StocksMarket />} />
              <Route path="/markets/crypto" element={<CryptoMarket />} />
              <Route path="/markets/forex" element={<ForexMarket />} />
              <Route path="/markets/funds" element={<FundsMarket />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
