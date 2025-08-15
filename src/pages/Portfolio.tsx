
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { useData } from "@/contexts/DataContext";
import { useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { BalanceChart } from "@/components/dashboard/BalanceChart";

export default function Portfolio() {
  const { 
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

  // Count positions by type
  const positionsByType = portfolio.reduce((acc, position) => {
    const type = position.assetType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppLayout>
      <PageTitle 
        title="My Portfolio" 
        description="Overview of your investment portfolio"
      />
      
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Portfolio Value"
            value={formatCurrency(portfolioValue)}
            icon={<DollarSign className="h-5 w-5" />}
          />
          
          <StatCard
            title="Total Profit/Loss"
            value={formatCurrency(portfolioProfitLoss)}
            icon={portfolioProfitLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            trend={portfolioPLPercentage}
            trendLabel="Overall"
          />
          
          <StatCard
            title="Asset Allocation"
            value={`${Object.entries(positionsByType).map(([key, val]) => `${key}: ${val}`).join(', ')}`}
            icon={<DollarSign className="h-5 w-5" />}
          />
        </div>

        {/* Portfolio Performance Chart */}
        <BalanceChart data={portfolioPerformance} />
        
        {/* Portfolio Positions */}
        <div>
          <PortfolioSummary positions={portfolio} />
        </div>
      </div>
    </AppLayout>
  );
}
