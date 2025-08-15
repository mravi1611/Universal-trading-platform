
import { Asset } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssetChange } from "@/components/ui/asset-change";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AssetDetail } from "@/components/assets/AssetDetail";
import { TradeDialog } from "@/components/assets/TradeDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AssetTableProps {
  title: string;
  assetType: string;
  assets: Asset[];
  showActions?: boolean;
  limit?: number;
}

export const AssetTable = ({
  title,
  assetType,
  assets,
  showActions = false,
  limit,
}: AssetTableProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const displayAssets = limit ? assets.slice(0, limit) : assets;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return value.toString();
  };

  const handleTradeClick = (asset: Asset) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        action: (
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 bg-primary text-white rounded-md text-xs" 
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button 
              className="px-3 py-1.5 bg-secondary text-white rounded-md text-xs" 
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        ),
      });
      return;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Symbol</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Volume
              </TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell className="hidden md:table-cell">{asset.symbol}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(asset.price.current)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {asset.price.change >= 0 ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <AssetChange value={asset.price.changePercent} />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {formatVolume(asset.volume)}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <AssetDetail asset={asset} />
                      {user ? (
                        <TradeDialog asset={asset} />
                      ) : (
                        <button
                          onClick={() => handleTradeClick(asset)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                        >
                          Trade
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
