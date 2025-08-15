
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Asset } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { logActivity, ActivityType } from "@/utils/activityLogger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TradeDialogProps {
  asset: Asset;
}

export const TradeDialog = ({ asset }: TradeDialogProps) => {
  const { profile, user } = useAuth();
  const { recordTrade } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(asset.price.current);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      quantity: 1,
      tradeType: "BUY",
    },
  });

  // Calculate the total amount when quantity or price changes
  useEffect(() => {
    setTotalAmount(quantity * asset.price.current);
  }, [quantity, asset.price.current]);

  // Log asset view when dialog is opened
  useEffect(() => {
    if (isOpen && user?.id) {
      logActivity(user.id, ActivityType.VIEW_ASSET, {
        assetId: asset.id,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.type,
        currentPrice: asset.price.current
      });
    }
  }, [isOpen, user?.id, asset]);

  const handleSubmit = async () => {
    if (!profile || !user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to trade",
        variant: "destructive",
      });
      return;
    }

    if (tradeType === "BUY" && profile.balance < totalAmount) {
      toast({
        title: "Insufficient funds",
        description: "Your balance is not enough for this purchase",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await recordTrade({
        assetId: asset.id,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.type,
        quantity: quantity,
        price: asset.price.current,
        amount: totalAmount,
        type: tradeType,
      });

      toast({
        title: "Trade successful",
        description: `You ${tradeType === "BUY" ? "bought" : "sold"} ${quantity} ${asset.symbol} for ${formatCurrency(totalAmount)}`,
        variant: "default",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error executing trade:", error);
      toast({
        title: "Trade failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Trade {asset.symbol}
            <Badge
              variant={asset.price.change >= 0 ? "secondary" : "destructive"}
            >
              {formatCurrency(asset.price.current)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid gap-4">
            <FormField
              control={form.control}
              name="tradeType"
              render={() => (
                <FormItem>
                  <FormLabel>Trade Type</FormLabel>
                  <Select 
                    value={tradeType} 
                    onValueChange={(value) => setTradeType(value as "BUY" | "SELL")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BUY">Buy</SelectItem>
                      <SelectItem value="SELL">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={() => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price:</p>
                <p className="font-medium">{formatCurrency(asset.price.current)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total:</p>
                <p className="font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>

            {profile && (
              <div className="border p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">Available Balance:</p>
                <p className="font-bold">{formatCurrency(profile.balance)}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || (tradeType === "BUY" && profile?.balance < totalAmount)}
              >
                {isSubmitting ? "Processing..." : `${tradeType} ${asset.symbol}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
