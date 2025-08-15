
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MarketData, Transaction, TradePosition } from "@/types";
import { getChartData } from "@/services/mockData";
import { useAuth } from "./AuthContext";
import { 
  fetchMarketData, 
  fetchTransactions, 
  fetchPortfolio 
} from "@/utils/dataOperations";
import {
  depositFunds as depositFundsUtil,
  withdrawFunds as withdrawFundsUtil,
  recordTrade as recordTradeUtil
} from "@/utils/transactionUtils";

interface DataContextType {
  marketData: MarketData;
  transactions: Transaction[];
  portfolio: TradePosition[];
  portfolioValue: number;
  portfolioProfitLoss: number;
  portfolioPerformance: { date: string; value: number }[];
  refreshData: () => void;
  depositFunds: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
  recordTrade: (trade: {
    assetId: string;
    assetSymbol: string;
    assetName: string;
    assetType: string;
    quantity: number;
    price: number;
    amount: number;
    type: "BUY" | "SELL";
  }) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  
  const [marketData, setMarketData] = useState<MarketData>({ stocks: [], crypto: [], forex: [], funds: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState<TradePosition[]>([]);
  const [portfolioPerformance, setPortfolioPerformance] = useState<{ date: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const portfolioValue = portfolio.reduce(
    (total, position) => total + position.currentPrice * position.quantity,
    0
  );

  const portfolioProfitLoss = portfolio.reduce(
    (total, position) => total + position.profitLoss,
    0
  );

  useEffect(() => {
    if (user?.id) {
      console.log("User found, initializing data:", user.id);
      refreshData();
    } else {
      console.log("No user found, clearing data");
      setMarketData({ stocks: [], crypto: [], forex: [], funds: [] });
      setTransactions([]);
      setPortfolio([]);
      setPortfolioPerformance([]);
    }
  }, [user?.id]);

  const refreshData = useCallback(() => {
    if (!user?.id) {
      console.log("No user ID available for data refresh");
      return;
    }
    
    const now = Date.now();
    if (now - lastRefresh < 1000) {
      console.log("Throttling data refresh");
      return;
    }
    
    console.log("Starting data refresh for user:", user.id);
    setIsLoading(true);
    setLastRefresh(now);

    // Fetch market data
    const market = fetchMarketData();
    setMarketData(market);

    // Fetch transactions
    fetchTransactions(user.id).then(txData => {
      console.log("Fetched transactions:", txData.length);
      setTransactions(txData);
    });

    // Fetch portfolio
    const portfolioData = fetchPortfolio(user.id);
    console.log("Fetched portfolio items:", portfolioData.length);
    setPortfolio(portfolioData);

    // Generate portfolio performance data
    const performanceData = getChartData(30);
    setPortfolioPerformance(performanceData);
    
    setIsLoading(false);
    console.log("Data refresh complete");
  }, [user?.id, lastRefresh]);

  // Handler for depositing funds
  const depositFunds = async (amount: number): Promise<void> => {
    if (!user?.id || !profile) {
      console.error("Cannot deposit: User not authenticated");
      return;
    }
    
    console.log(`Depositing $${amount} for user ${user.id}`);
    await depositFundsUtil(user.id, amount, profile, transactions);
    
    console.log("Deposit completed, refreshing data");
    refreshData();
  };

  // Handler for withdrawing funds
  const withdrawFunds = async (amount: number): Promise<void> => {
    if (!user?.id || !profile) {
      console.error("Cannot withdraw: User not authenticated");
      return;
    }
    
    console.log(`Withdrawing $${amount} for user ${user.id}`);
    await withdrawFundsUtil(user.id, amount, profile, transactions);
    
    console.log("Withdrawal completed, refreshing data");
    refreshData();
  };

  // Handler for recording trades
  const recordTrade = async (trade: {
    assetId: string;
    assetSymbol: string;
    assetName: string;
    assetType: string;
    quantity: number;
    price: number;
    amount: number;
    type: "BUY" | "SELL";
  }): Promise<void> => {
    if (!user?.id || !profile) {
      throw new Error("User not authenticated");
    }
    
    console.log(`Recording ${trade.type} trade for ${trade.assetSymbol}`);
    await recordTradeUtil(user.id, profile, trade, transactions);
    
    console.log("Trade recorded, refreshing data");
    refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        marketData,
        transactions,
        portfolio,
        portfolioValue,
        portfolioProfitLoss,
        portfolioPerformance,
        refreshData,
        depositFunds,
        withdrawFunds,
        recordTrade,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
