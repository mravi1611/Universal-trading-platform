
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useData } from "@/contexts/DataContext";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Asset } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function StocksMarket() {
  const { marketData, refreshData } = useData();
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only refresh data if we don't already have it
    if (!marketData.stocks || marketData.stocks.length === 0) {
      refreshData();
    } else {
      setStocks(marketData.stocks);
      setIsLoading(false);
    }
  }, [refreshData, marketData.stocks]);

  // Update local state when marketData changes
  useEffect(() => {
    if (marketData.stocks && marketData.stocks.length > 0) {
      setStocks(marketData.stocks);
      setIsLoading(false);
    }
  }, [marketData.stocks]);

  return (
    <AppLayout>
      <PageTitle 
        title="Stock Market" 
        description="Explore global stock market opportunities"
      />
      
      <div className="grid gap-6">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <AssetTable 
            title="Global Stocks" 
            assetType="STOCK" 
            assets={stocks}
            showActions={true}
          />
        )}
      </div>
    </AppLayout>
  );
}
