
import { Transaction, UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "./dataOperations";
import { logActivity, ActivityType } from "@/utils/activityLogger";

// Deposit funds
export const depositFunds = async (
  userId: string, 
  amount: number, 
  profile: UserProfile,
  currentTransactions: Transaction[]
): Promise<void> => {
  if (!userId) return;

  try {
    if (isValidUUID(userId)) {
      // Supabase operations for valid UUID
      const { error } = await supabase
        .from('profiles')
        .update({ balance: profile.balance + amount })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      
      const newTransaction = {
        user_id: userId,
        type: "DEPOSIT",
        amount: amount,
        status: "COMPLETED",
        description: "Deposit funds"
      };
      
      const { error: txError } = await supabase
        .from('transactions')
        .insert(newTransaction);
        
      if (txError) throw txError;
      
      // Log the deposit activity
      await logActivity(userId, ActivityType.DEPOSIT, {
        amount,
        newBalance: profile.balance + amount,
        transactionType: "DEPOSIT"
      });
      
    } else {
      // Local storage operations for development
      const newTransaction: Transaction = {
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        userId: userId,
        type: "DEPOSIT",
        amount,
        status: "COMPLETED",
        description: "Deposit funds",
        createdAt: new Date().toISOString(),
      };
      
      const updatedTransactions = [newTransaction, ...currentTransactions];
      localStorage.setItem(`aether_transactions_${userId}`, JSON.stringify(updatedTransactions));
      
      const updatedProfile = {
        ...profile,
        balance: profile.balance + amount,
      };
      localStorage.setItem(`aether_profile_${userId}`, JSON.stringify(updatedProfile));
      
      // Log the deposit activity for development mode
      await logActivity(userId, ActivityType.DEPOSIT, {
        amount,
        newBalance: updatedProfile.balance,
        transactionType: "DEPOSIT",
        mode: "development"
      });
    }
  } catch (error) {
    console.error("Error processing deposit:", error);
    throw error;
  }
};

// Withdraw funds
export const withdrawFunds = async (
  userId: string, 
  amount: number, 
  profile: UserProfile,
  currentTransactions: Transaction[]
): Promise<void> => {
  if (!userId) return;
  
  if (profile.balance < amount) {
    throw new Error("Insufficient funds");
  }
  
  try {
    if (isValidUUID(userId)) {
      // Supabase operations for valid UUID
      const { error } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - amount })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      
      const newTransaction = {
        user_id: userId,
        type: "WITHDRAWAL",
        amount: -amount,
        status: "COMPLETED",
        description: "Withdraw funds"
      };
      
      const { error: txError } = await supabase
        .from('transactions')
        .insert(newTransaction);
        
      if (txError) throw txError;
      
      // Log the withdrawal activity
      await logActivity(userId, ActivityType.WITHDRAWAL, {
        amount: -amount,
        newBalance: profile.balance - amount,
        transactionType: "WITHDRAWAL"
      });
      
    } else {
      // Local storage operations for development
      const newTransaction: Transaction = {
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        userId: userId,
        type: "WITHDRAWAL",
        amount: -amount,
        status: "COMPLETED",
        description: "Withdraw funds",
        createdAt: new Date().toISOString(),
      };
      
      const updatedTransactions = [newTransaction, ...currentTransactions];
      localStorage.setItem(`aether_transactions_${userId}`, JSON.stringify(updatedTransactions));
      
      const updatedProfile = {
        ...profile,
        balance: profile.balance - amount,
      };
      localStorage.setItem(`aether_profile_${userId}`, JSON.stringify(updatedProfile));
      
      // Log the withdrawal activity for development mode
      await logActivity(userId, ActivityType.WITHDRAWAL, {
        amount: -amount,
        newBalance: updatedProfile.balance,
        transactionType: "WITHDRAWAL",
        mode: "development"
      });
    }
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw error;
  }
};

// Record trade
export const recordTrade = async (
  userId: string,
  profile: UserProfile,
  trade: {
    assetId: string;
    assetSymbol: string;
    assetName: string;
    assetType: string;
    quantity: number;
    price: number;
    amount: number;
    type: "BUY" | "SELL";
  },
  currentTransactions: Transaction[]
): Promise<void> => {
  if (!userId) throw new Error("User not authenticated");
  
  try {
    // For local development/testing with mocked IDs
    if (!isValidUUID(userId)) {
      // Record the trade in localStorage
      const tradeRecord = {
        id: `trade-${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId,
        asset_id: trade.assetId,
        asset_symbol: trade.assetSymbol,
        asset_name: trade.assetName,
        asset_type: trade.assetType,
        quantity: trade.quantity,
        price: trade.price,
        amount: trade.amount,
        type: trade.type,
        status: "completed",
        created_at: new Date().toISOString()
      };
      
      // Store trade in localStorage
      const storedTrades = localStorage.getItem(`aether_trades_${userId}`) || '[]';
      const trades = JSON.parse(storedTrades);
      trades.unshift(tradeRecord);
      localStorage.setItem(`aether_trades_${userId}`, JSON.stringify(trades));
      
      // Update user balance in localStorage
      const newBalance = trade.type === "BUY" 
        ? profile.balance - trade.amount 
        : profile.balance + trade.amount;
        
      const updatedProfile = {
        ...profile,
        balance: newBalance,
      };
      localStorage.setItem(`aether_profile_${userId}`, JSON.stringify(updatedProfile));
      
      // Record transaction
      const transactionAmount = trade.type === "BUY" ? -trade.amount : trade.amount;
      const newTransaction: Transaction = {
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        userId: userId,
        type: "TRADE",
        amount: transactionAmount,
        status: "COMPLETED",
        description: `${trade.type} ${trade.quantity} ${trade.assetSymbol} at ${trade.price} per unit`,
        createdAt: new Date().toISOString(),
      };
      
      const updatedTransactions: Transaction[] = [newTransaction, ...currentTransactions];
      localStorage.setItem(`aether_transactions_${userId}`, JSON.stringify(updatedTransactions));
      
      // Log the trade activity
      await logActivity(userId, ActivityType.TRADE, {
        assetSymbol: trade.assetSymbol,
        assetName: trade.assetName,
        assetType: trade.assetType,
        quantity: trade.quantity,
        price: trade.price,
        amount: trade.amount,
        tradeType: trade.type,
        newBalance: newBalance,
        mode: "development"
      });
      
      return;
    }
    
    // If we have a valid UUID, proceed with Supabase
    const safeUserId = userId;
    const newTrade = {
      user_id: safeUserId,
      asset_id: trade.assetId,
      asset_symbol: trade.assetSymbol,
      asset_name: trade.assetName,
      asset_type: trade.assetType,
      quantity: trade.quantity,
      price: trade.price,
      amount: trade.amount,
      type: trade.type,
      status: "completed"
    };
    
    const { error: tradeError } = await supabase
      .from('trades')
      .insert(newTrade);
      
    if (tradeError) throw tradeError;
    
    const transactionAmount = trade.type === "BUY" ? -trade.amount : trade.amount;
    const newTransaction = {
      user_id: safeUserId,
      type: "TRADE",
      amount: transactionAmount,
      status: "COMPLETED",
      description: `${trade.type} ${trade.quantity} ${trade.assetSymbol} at ${trade.price} per unit`
    };
    
    const { error: txError } = await supabase
      .from('transactions')
      .insert(newTransaction);
      
    if (txError) throw txError;
    
    const newBalance = trade.type === "BUY" 
      ? profile.balance - trade.amount 
      : profile.balance + trade.amount;
      
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', safeUserId);
      
    if (profileError) throw profileError;
    
    // Log the trade activity in Supabase
    await logActivity(safeUserId, ActivityType.TRADE, {
      assetSymbol: trade.assetSymbol,
      assetName: trade.assetName,
      assetType: trade.assetType,
      quantity: trade.quantity,
      price: trade.price,
      amount: trade.amount,
      tradeType: trade.type,
      newBalance: newBalance
    });
    
  } catch (error) {
    console.error("Error recording trade:", error);
    throw error;
  }
};
