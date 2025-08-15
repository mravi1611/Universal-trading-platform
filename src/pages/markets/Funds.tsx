
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useData } from "@/contexts/DataContext";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Asset } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function FundsMarket() {
  const { marketData, refreshData } = useData();
  const [funds, setFunds] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only refresh data if we don't already have it
    if (!marketData.funds || marketData.funds.length === 0) {
      refreshData();
    } else {
      setFunds(marketData.funds);
      setIsLoading(false);
    }
  }, [refreshData, marketData.funds]);

  // Update local state when marketData changes
  useEffect(() => {
    if (marketData.funds && marketData.funds.length > 0) {
      setFunds(marketData.funds);
      setIsLoading(false);
    }
  }, [marketData.funds]);

  return (
    <AppLayout>
      <PageTitle 
        title="Mutual Funds" 
        description="Explore mutual fund investment opportunities"
      />
      
      <div className="grid gap-6">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <AssetTable 
            title="Mutual Funds" 
            assetType="FUND" 
            assets={funds}
            showActions={true}
          />
        )}
      </div>
    </AppLayout>
  );
}
