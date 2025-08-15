
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useData } from "@/contexts/DataContext";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Asset } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CryptoMarket() {
  const { marketData, refreshData } = useData();
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only refresh data if we don't already have it
    if (!marketData.crypto || marketData.crypto.length === 0) {
      refreshData();
    } else {
      setCrypto(marketData.crypto);
      setIsLoading(false);
    }
  }, [refreshData, marketData.crypto]);

  // Update local state when marketData changes
  useEffect(() => {
    if (marketData.crypto && marketData.crypto.length > 0) {
      setCrypto(marketData.crypto);
      setIsLoading(false);
    }
  }, [marketData.crypto]);

  return (
    <AppLayout>
      <PageTitle 
        title="Cryptocurrency Market" 
        description="Explore cryptocurrency trading opportunities"
      />
      
      <div className="grid gap-6">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <AssetTable 
            title="Cryptocurrencies" 
            assetType="CRYPTO" 
            assets={crypto}
            showActions={true}
          />
        )}
      </div>
    </AppLayout>
  );
}
