
export interface UserAuth {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRADE";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  createdAt: string;
}

export interface AssetPrice {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: "STOCK" | "CRYPTO" | "FOREX" | "FUND";
  price: AssetPrice;
  volume: number;
}

export interface MarketData {
  stocks: Asset[];
  crypto: Asset[];
  forex: Asset[];
  funds: Asset[];
}

export interface TradePosition {
  id: string;
  userId: string;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  assetType: "STOCK" | "CRYPTO" | "FOREX" | "FUND";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
  createdAt: string;
}

export interface AssetHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KycDocument {
  id: string;
  documentType: string;
  status: string;
  documentUrl: string;
  userId?: string;
  createdAt?: string; // Keep as optional
}
