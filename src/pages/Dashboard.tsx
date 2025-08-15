
import { useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { StatCard } from "@/components/ui/stat-card";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Wallet, DollarSign, BarChart3, LineChart } from "lucide-react";

export default function Dashboard() {
  const { profile } = useAuth();
  const { 
    marketData, 
    transactions, 
    portfolio, 
    portfolioValue, 
    portfolioProfitLoss,
    portfolioPerformance, 
    refreshData 
  } = useData();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate portfolio profit/loss percentage
  const portfolioValueWithoutPL = portfolioValue - portfolioProfitLoss;
  const portfolioPLPercentage = portfolioValueWithoutPL > 0
    ? (portfolioProfitLoss / portfolioValueWithoutPL) * 100
    : 0;

  return (
    <AppLayout>
      <PageTitle 
        title="Dashboard" 
        description="Overview of your trading account"
      />
      
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Account Balance"
            value={profile ? formatCurrency(profile.balance) : "$0"}
            icon={<Wallet className="h-5 w-5" />}
          />
          
          <StatCard
            title="Portfolio Value"
            value={formatCurrency(portfolioValue)}
            icon={<DollarSign className="h-5 w-5" />}
            trend={portfolioValue > 0 ? portfolioPLPercentage : 0}
            trendLabel="Overall"
          />
          
          <StatCard
            title="Active Positions"
            value={portfolio.length}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          
          <StatCard
            title="Recent Transactions"
            value={transactions.length}
            icon={<LineChart className="h-5 w-5" />}
          />
        </div>

        {/* Balance Chart */}
        <BalanceChart data={portfolioPerformance} />
        
        {/* Portfolio & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioSummary positions={portfolio} limit={5} />
          <TransactionsList transactions={transactions} limit={5} />
        </div>
        
        {/* Market Data */}
        <div className="grid grid-cols-1 gap-6">
          <AssetTable 
            title="Top Stocks" 
            assetType="STOCK" 
            assets={marketData.stocks}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AssetTable 
              title="Top Cryptocurrencies" 
              assetType="CRYPTO" 
              assets={marketData.crypto}
            />
            
            <AssetTable 
              title="Forex Pairs" 
              assetType="FOREX" 
              assets={marketData.forex}
            />
            
            <AssetTable 
              title="Mutual Funds" 
              assetType="FUND" 
              assets={marketData.funds}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
