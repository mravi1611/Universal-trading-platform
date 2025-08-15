
import { TradePosition } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DataCard } from "@/components/ui/data-card";
import { AssetChange } from "@/components/ui/asset-change";
import { Badge } from "@/components/ui/badge";

interface PortfolioSummaryProps {
  positions: TradePosition[];
  limit?: number;
  className?: string;
}

export function PortfolioSummary({ positions, limit, className }: PortfolioSummaryProps) {
  // Take only the specified number of positions if limit is provided
  const displayPositions = limit ? positions.slice(0, limit) : positions;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get badge for asset type
  const getAssetTypeBadge = (type: string) => {
    switch (type) {
      case "STOCK":
        return <Badge className="bg-trading-blue-lightest">Stock</Badge>;
      case "CRYPTO":
        return <Badge className="bg-trading-gold">Crypto</Badge>;
      case "FOREX":
        return <Badge className="bg-trading-purple">Forex</Badge>;
      case "FUND":
        return <Badge className="bg-trading-green">Fund</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <DataCard 
      title="Portfolio Positions" 
      className={className}
      description={limit ? "Your top positions by value" : "All portfolio positions"}
    >
      <div className="overflow-hidden rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{position.assetSymbol}</div>
                    <div className="text-xs text-muted-foreground">{position.assetName}</div>
                  </div>
                </TableCell>
                <TableCell>{getAssetTypeBadge(position.assetType)}</TableCell>
                <TableCell className="text-right">{position.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(position.currentPrice)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(position.currentPrice * position.quantity)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className={position.profitLoss >= 0 ? "text-trading-green" : "text-trading-red"}>
                      {formatCurrency(position.profitLoss)}
                    </span>
                    <AssetChange value={position.profitLossPercent} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {displayPositions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No positions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DataCard>
  );
}
