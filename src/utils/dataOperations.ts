
import { MarketData, Transaction, TradePosition, UserProfile, AssetHistoricalData } from "@/types";
import { 
  generateMockMarketData, 
  generateMockTransactions, 
  generateMockPortfolio,
  generateHistoricalData
} from "@/services/mockData";
import { supabase } from "@/integrations/supabase/client";

// Market data operations
export const fetchMarketData = (): MarketData => {
  return generateMockMarketData(50); // Expanded to 50 items per category
};

// Transaction operations
export const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
  // Skip Supabase if userId is not a valid UUID (development environment)
  if (!isValidUUID(userId)) {
    return getLocalTransactions(userId);
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        type: item.type as "DEPOSIT" | "WITHDRAWAL" | "TRADE",
        amount: item.amount,
        status: item.status as "PENDING" | "COMPLETED" | "FAILED",
        description: item.description || `${item.type} transaction`,
        createdAt: item.created_at
      }));
      
      return formattedTransactions;
    } 
    
    return getLocalTransactions(userId);
  } catch (error) {
    console.error("Error loading transactions:", error);
    return getLocalTransactions(userId);
  }
};

const getLocalTransactions = (userId: string): Transaction[] => {
  const storedTransactions = localStorage.getItem(`aether_transactions_${userId}`);
  if (storedTransactions) {
    return JSON.parse(storedTransactions);
  }
  
  const newTransactions = generateMockTransactions(userId, 10);
  localStorage.setItem(`aether_transactions_${userId}`, JSON.stringify(newTransactions));
  return newTransactions;
};

// Portfolio operations
export const fetchPortfolio = (userId: string): TradePosition[] => {
  const storedPortfolio = localStorage.getItem(`aether_portfolio_${userId}`);
  if (storedPortfolio) {
    return JSON.parse(storedPortfolio);
  }
  
  const newPortfolio = generateMockPortfolio(userId);
  localStorage.setItem(`aether_portfolio_${userId}`, JSON.stringify(newPortfolio));
  return newPortfolio;
};

// Fetch historical data for candlestick charts
export const fetchAssetHistoricalData = (assetId: string, assetType: string, days: number = 30): AssetHistoricalData[] => {
  return generateHistoricalData(assetId, assetType, days);
};

// Helper for validating UUID format
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper for generating fallback ID
export const generateFallbackId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
