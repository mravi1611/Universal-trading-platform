
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useData } from "@/contexts/DataContext";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Asset } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForexMarket() {
  const { marketData, refreshData } = useData();
  const [forex, setForex] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only refresh data if we don't already have it
    if (!marketData.forex || marketData.forex.length === 0) {
      refreshData();
    } else {
      setForex(marketData.forex);
      setIsLoading(false);
    }
  }, [refreshData, marketData.forex]);

  // Update local state when marketData changes
  useEffect(() => {
    if (marketData.forex && marketData.forex.length > 0) {
      setForex(marketData.forex);
      setIsLoading(false);
    }
  }, [marketData.forex]);

  return (
    <AppLayout>
      <PageTitle 
        title="Forex Market" 
        description="Explore foreign exchange trading opportunities"
      />
      
      <div className="grid gap-6">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <AssetTable 
            title="Forex Pairs" 
            assetType="FOREX" 
            assets={forex}
            showActions={true}
          />
        )}
      </div>
    </AppLayout>
  );
}
