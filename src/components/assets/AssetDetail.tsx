
import { useState, useEffect } from "react";
import { Asset, AssetHistoricalData } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { fetchAssetHistoricalData } from "@/utils/dataOperations";

interface AssetDetailProps {
  asset: Asset;
}

export const AssetDetail = ({ asset }: AssetDetailProps) => {
  const [historicalData, setHistoricalData] = useState<AssetHistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState<number>(30); // Default to 30 days

  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
    const newData = fetchAssetHistoricalData(asset.id, asset.type, days);
    setHistoricalData(newData);
  };

  useEffect(() => {
    const data = fetchAssetHistoricalData(asset.id, asset.type, timeRange);
    setHistoricalData(data);
  }, [asset.id, asset.type, timeRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Chart</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset.symbol} - {asset.name}
            <Badge variant={asset.price.change >= 0 ? "secondary" : "destructive"}>
              {asset.price.changePercent > 0 ? "+" : ""}
              {asset.price.changePercent.toFixed(2)}%
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Price</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-2xl font-bold">{formatPrice(asset.price.current)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className={`text-2xl font-bold ${asset.price.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {asset.price.change > 0 ? "+" : ""}
                  {formatPrice(asset.price.change)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <CandlestickChart
            data={historicalData}
            assetName={asset.name}
            assetSymbol={asset.symbol}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
