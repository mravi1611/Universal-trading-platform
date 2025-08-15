
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "./dataOperations";

export enum ActivityType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  TRADE = "TRADE",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  PROFILE_UPDATE = "PROFILE_UPDATE",
  VIEW_ASSET = "VIEW_ASSET",
  SYSTEM = "SYSTEM"
}

/**
 * Logs user activity to the database
 */
export const logActivity = async (
  userId: string,
  actionType: ActivityType | string,
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    // Get client IP and user agent if available
    const clientInfo = {
      userAgent: navigator.userAgent || "unknown",
    };

    if (isValidUUID(userId)) {
      // Use Supabase for persistent storage with valid UUID
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action_type: actionType,
        details: details,
        user_agent: clientInfo.userAgent,
      });
    } else {
      // For development mode, store in localStorage
      const storageKey = `aether_activity_logs_${userId}`;
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const newLog = {
        id: `log-${Math.random().toString(36).substring(2, 9)}`,
        userId,
        actionType,
        details,
        userAgent: clientInfo.userAgent,
        createdAt: new Date().toISOString(),
      };
      
      existingLogs.unshift(newLog);
      localStorage.setItem(storageKey, JSON.stringify(existingLogs.slice(0, 100))); // Keep only the 100 most recent logs
    }
    
    console.log(`Activity logged: ${actionType}`, details);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
