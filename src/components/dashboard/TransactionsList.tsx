
import { Transaction } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DataCard } from "@/components/ui/data-card";
import { ArrowUpRight, ArrowDownLeft, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
  className?: string;
}

export function TransactionsList({ transactions, limit, className }: TransactionsListProps) {
  // Take only the specified number of transactions if limit is provided
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="w-4 h-4 text-trading-green" />;
      case "WITHDRAWAL":
        return <ArrowUpRight className="w-4 h-4 text-trading-red" />;
      case "TRADE":
        return <Repeat className="w-4 h-4 text-trading-blue-lightest" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DataCard 
      title="Recent Transactions" 
      className={className}
      description={limit ? "View your most recent transactions" : "All transaction history"}
    >
      <div className="overflow-hidden rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(tx.type)}
                    <span>{tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell className={tx.amount >= 0 ? "text-trading-green" : "text-trading-red"}>
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(tx.createdAt)}</TableCell>
                <TableCell className="max-w-xs truncate">{tx.description}</TableCell>
              </TableRow>
            ))}
            {displayTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DataCard>
  );
}
