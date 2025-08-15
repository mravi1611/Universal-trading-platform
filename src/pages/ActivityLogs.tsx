
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "@/utils/dataOperations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { ActivityType } from "@/utils/activityLogger";
import { Json } from "@/integrations/supabase/types";

interface ActivityLog {
  id: string;
  actionType: string;
  details: any; // Changed from Record<string, any> to any to accommodate all possible value types from Supabase
  createdAt: string;
  userAgent?: string;
}

export default function ActivityLogs() {
  const { user } = useAuth();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchActivityLogs = async () => {
      setIsLoading(true);
      
      try {
        if (isValidUUID(user.id)) {
          // Fetch from Supabase
          const { data, error, count } = await supabase
            .from("activity_logs")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range((currentPage - 1) * logsPerPage, currentPage * logsPerPage - 1);
            
          if (error) throw error;
          
          if (data) {
            const formattedLogs: ActivityLog[] = data.map(log => ({
              id: log.id,
              actionType: log.action_type,
              details: log.details || {}, // Ensure we always have at least an empty object
              createdAt: log.created_at,
              userAgent: log.user_agent || undefined
            }));
            
            setActivityLogs(formattedLogs);
            setTotalPages(Math.ceil((count || 0) / logsPerPage));
          }
        } else {
          // Load from localStorage for development
          const storageKey = `aether_activity_logs_${user.id}`;
          const storedLogs = JSON.parse(localStorage.getItem(storageKey) || "[]");
          
          const paginatedLogs = storedLogs.slice(
            (currentPage - 1) * logsPerPage,
            currentPage * logsPerPage
          );
          
          setActivityLogs(paginatedLogs);
          setTotalPages(Math.ceil(storedLogs.length / logsPerPage));
        }
      } catch (error) {
        console.error("Failed to load activity logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, [user?.id, currentPage]);

  const getBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case ActivityType.LOGIN:
      case ActivityType.LOGOUT:
        return "outline";
      case ActivityType.DEPOSIT:
        return "secondary";
      case ActivityType.WITHDRAWAL:
        return "destructive";
      case ActivityType.TRADE:
        return "default";
      case ActivityType.PROFILE_UPDATE:
        return "outline";
      case ActivityType.VIEW_ASSET:
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderActivityDetails = (actionType: string, details: any) => {
    // If details is not an object, convert it to string representation
    if (typeof details !== 'object' || details === null) {
      return String(details);
    }
    
    switch (actionType) {
      case ActivityType.LOGIN:
        return `Logged in using ${details.email || 'unknown email'}`;
      case ActivityType.LOGOUT:
        return "Logged out";
      case ActivityType.DEPOSIT:
        return `Deposited ${formatCurrency(details.amount || 0)}`;
      case ActivityType.WITHDRAWAL:
        return `Withdrew ${formatCurrency(Math.abs(details.amount || 0))}`;
      case ActivityType.TRADE:
        return `${details.tradeType || 'Traded'} ${details.quantity || ''} ${details.assetSymbol || ''} at ${formatCurrency(details.price || 0)} each`;
      case ActivityType.PROFILE_UPDATE:
        return "Updated profile information";
      case ActivityType.VIEW_ASSET:
        return `Viewed asset: ${details.assetSymbol || 'unknown'}`;
      default:
        return JSON.stringify(details);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <AppLayout>
      <PageTitle 
        title="Activity Logs" 
        description="View your recent account activities"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
          <CardDescription>Track all actions performed in your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(log.actionType)}>
                            {log.actionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{renderActivityDetails(log.actionType, log.details)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No activities recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
